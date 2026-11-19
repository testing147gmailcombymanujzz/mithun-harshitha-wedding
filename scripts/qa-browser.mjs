import { spawn, spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseUrl = process.env.WEDDING_QA_URL ?? 'http://127.0.0.1:4180/';
const debugPort = 9331;
const edgeExecutable = join(process.env['PROGRAMFILES(X86)'] ?? 'C:\\Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe');
const profileDir = await mkdtemp(join(tmpdir(), 'wedding-edge-qa-'));
const screenshotsDir = join(tmpdir(), 'wedding-qa-screenshots');
const viewports = [1920, 1440, 1366, 768, 390, 375, 360];
const failures = [];
const consoleErrors = [];
const networkFailures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function waitFor(predicate, timeoutMs = 15_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const value = await predicate();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('Timed out while starting headless Edge.');
}

class DevToolsPage {
  sequence = 0;
  callbacks = new Map();
  listeners = new Map();

  constructor(socket) {
    this.socket = socket;
    socket.addEventListener('message', async ({ data }) => {
      const raw = typeof data === 'string' ? data : await data.text();
      const message = JSON.parse(raw);
      if (message.id) {
        const callback = this.callbacks.get(message.id);
        if (!callback) return;
        this.callbacks.delete(message.id);
        message.error ? callback.reject(new Error(message.error.message)) : callback.resolve(message.result);
        return;
      }
      this.listeners.get(message.method)?.forEach((listener) => listener(message.params));
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) ?? [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  send(method, params = {}) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression, options = {}) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
      userGesture: options.userGesture ?? false,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text ?? 'Browser evaluation failed.');
    return result.result.value;
  }
}

let browser;
let page;

try {
  await mkdir(screenshotsDir, { recursive: true });
  browser = spawn(edgeExecutable, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${debugPort}`, '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`, baseUrl,
  ], { stdio: 'ignore', windowsHide: true });

  const version = await waitFor(async () => {
    try { return await (await fetch(`http://127.0.0.1:${debugPort}/json/version`)).json(); } catch { return null; }
  });
  const target = await waitFor(async () => {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
      return targets.find((item) => item.type === 'page' && item.url.startsWith(baseUrl));
    } catch { return null; }
  });
  if (!version || !target) throw new Error('Headless Edge did not expose the invitation tab.');
  console.log(`Browser: ${version.Browser}; CDP target: ${target.url}`);
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  page = new DevToolsPage(socket);
  socket.addEventListener('close', (event) => console.error(`CDP socket closed (${event.code}).`));
  socket.addEventListener('error', (event) => console.error(`CDP socket error: ${event.message ?? 'unknown error'}.`));
  page.on('Runtime.exceptionThrown', ({ exceptionDetails }) => consoleErrors.push(exceptionDetails.exception?.description ?? exceptionDetails.text));
  page.on('Log.entryAdded', ({ entry }) => { if (entry.level === 'error') consoleErrors.push(entry.text); });
  page.on('Network.loadingFailed', (event) => {
    if (event.errorText !== 'net::ERR_ABORTED') networkFailures.push(`${event.errorText}: ${event.requestId}`);
  });
  await page.send('Runtime.enable');
  await page.send('Log.enable');
  await page.send('Network.enable');
  await page.send('Page.enable');

  for (const width of viewports) {
    const mobile = width <= 420;
    await page.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile });
    await page.send('Page.navigate', { url: baseUrl });
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    console.log(`Checking viewport ${width}px`);
    const result = await page.evaluate(`(async () => {
      await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 4000))]);
      const target = new Date('2026-12-11T07:58:00+05:30').getTime();
      const seconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const expected = [Math.floor(seconds / 86400), Math.floor((seconds % 86400) / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map(value => String(value).padStart(2, '0'));
      const actual = [...document.querySelectorAll('.save-date__value')].map(element => element.textContent.trim());
      const animationName = (selector, pseudo) => {
        const element = document.querySelector(selector);
        return element ? getComputedStyle(element, pseudo).animationName : 'missing';
      };
      const requiredCopy = [
        'Mithun', 'Harshitha', 'Mithun .Z', 'Son of:', 'Smt. Kumari & Sri Lokesh',
        'No. 50, 4th Cross, CIL Colony,', 'Cholanayakanahalli, RT Nagar Post,', 'Bengaluru - 560032.',
        'Harshitha .M', 'Daughter of:', 'Smt. Manjula & Sri Mohan Babu',
        'No. 237, Sulikunte,', 'Dommasandra Post, Sarjapura Road,', 'Bengaluru - 562125.',
        'Thursday, 10 December 2026', '6:30 PM onwards', 'Friday, 11 December 2026', '7:58 AM to 8:50 AM', 'Lagna: Dhanu',
        'Samskruthi Pavilion Convention Center', 'Sulikunte, Sarjapura - Marathahalli Road,', 'Sulikunte Colony, Bengaluru - 562125.',
        '11 December 2026', '7:58 AM IST',
        'Late Smt. Shambhamma & Late Sri Thimmarayappa', 'Family, Relatives & Friends',
        'We would be honoured by your gracious presence', 'and blessings on our special day.', '10 & 11 December 2026',
        'Every beautiful beginning deserves an invitation as special as the moment.',
        'Want a beautiful digital invitation for your special occasion?', 'Designed with love by Manoj Kumar N',
        'Phone: 8095828114', 'Email: manojkumarn858@gmail.com', "Let's make your special moments unforgettable.",
      ];
      const missingCopy = requiredCopy.filter(value => !document.body.innerText.includes(value));
      const overflow = [...document.querySelectorAll('body *')].filter(element => {
        if (element.closest('.wedding-envelope')) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && style.position !== 'fixed' && (rect.right > innerWidth + 1 || rect.left < -1);
      }).slice(0, 12).map(element => ({ tag: element.tagName, className: String(element.className?.baseVal ?? element.className ?? ''), left: Math.round(element.getBoundingClientRect().left), right: Math.round(element.getBoundingClientRect().right) }));
      return {
        width: innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth,
        overflow, brokenImages: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src),
        fonts: [...document.fonts].map(font => ({ family: font.family, status: font.status })),
        requiredFontsLoaded: ['Great Vibes', 'Cormorant Garamond', 'DM Sans'].every(family => [...document.fonts].some(font => font.family.includes(family) && font.status === 'loaded')),
        countdownExpected: expected, countdownActual: actual,
        countdownExpectedSeconds: seconds,
        countdownActualSeconds: actual.reduce((total, value, index) => total + Number(value) * [86400, 3600, 60, 1][index], 0),
        musicPausedAtLoad: document.querySelector('#wedding-music')?.paused,
        autoplayAttempted: document.querySelector('#wedding-music')?.dataset.autoplayAttempted === 'true',
        pageElapsedMs: performance.now(),
        heroNamesVisible: [...document.querySelectorAll('.hero__name')].every(element => element.getBoundingClientRect().width > 0 && Number(getComputedStyle(element).opacity) > 0.65),
        designerLinks: [...document.querySelectorAll('.footer__contact a')].map(anchor => anchor.getAttribute('href')),
        calendarButtons: [...document.querySelectorAll('a[download]')].map(anchor => anchor.getAttribute('href')),
        mapsHref: document.querySelector('.venue-card__directions')?.href,
        accessibility: {
          h1Count: document.querySelectorAll('h1').length,
          imagesWithoutAlt: [...document.images].filter(image => !image.hasAttribute('alt')).map(image => image.src),
          linksWithoutName: [...document.querySelectorAll('a')].filter(link => !link.textContent.trim() && !link.getAttribute('aria-label')).map(link => link.outerHTML.slice(0, 100)),
          musicHasLabel: Boolean(document.querySelector('.music-control')?.getAttribute('aria-label')),
          skipLink: document.querySelector('.skip-link')?.getAttribute('href'),
        },
        sectionsPresent: ['#top', '#save-the-date', '#couple', '#events', '#venue', '.closing-section'].every(selector => Boolean(document.querySelector(selector))),
        animationNames: {
          petals: animationName('.hero__petals i'),
          floralArch: animationName('.hero__artwork', '::before'),
          dividers: animationName('.section-divider span'),
          countdown: animationName('.save-date__value'),
          sparkles: animationName('.save-date__sparkles i'),
        },
        content: document.body.innerText,
        missingCopy,
        formalPrefixes: [...document.querySelectorAll('.person-card__honorific')].map(element => element.textContent.trim()),
        qualifications: [...document.querySelectorAll('.person-card .qualification')].map(element => element.textContent.trim()),
        heroDegreesPresent: Boolean(document.querySelector('.degrees')),
        resourcePayloadBytes: performance.getEntriesByType('resource').reduce((sum, item) => sum + (item.encodedBodySize || 0), 0),
        firstContentfulPaintMs: performance.getEntriesByType('paint').find(item => item.name === 'first-contentful-paint')?.startTime ?? null,
      };
    })()`);
    console.log(JSON.stringify({ viewport: width, documentWidth: result.documentWidth, bodyWidth: result.bodyWidth, overflow: result.overflow, brokenImages: result.brokenImages, requiredFontsLoaded: result.requiredFontsLoaded, countdownExpected: result.countdownExpected, countdownActual: result.countdownActual, musicPausedAtLoad: result.musicPausedAtLoad, autoplayAttempted: result.autoplayAttempted, pageElapsedMs: Math.round(result.pageElapsedMs), heroNamesVisible: result.heroNamesVisible, firstContentfulPaintMs: result.firstContentfulPaintMs, resourcePayloadBytes: result.resourcePayloadBytes, calendarButtons: result.calendarButtons }));
    assert(result.documentWidth <= width && result.bodyWidth <= width, `Horizontal overflow at ${width}px.`);
    assert(result.overflow.length === 0, `Off-canvas elements at ${width}px: ${JSON.stringify(result.overflow)}`);
    assert(result.brokenImages.length === 0, `Broken image(s) at ${width}px: ${result.brokenImages.join(', ')}`);
    assert(result.requiredFontsLoaded, `A required display, script, or body font did not load at ${width}px.`);
    if (result.pageElapsedMs < 3_000) {
      assert(result.musicPausedAtLoad === true && !result.autoplayAttempted, `Music started before the requested three-second delay at ${width}px.`);
    }
    assert(result.heroNamesVisible, `Hero name animation did not finish after the entrance at ${width}px.`);
    assert(JSON.stringify(result.qualifications) === JSON.stringify(['B.Com', 'B.E.']), `Couple education details are incorrect at ${width}px: ${JSON.stringify(result.qualifications)}.`);
    assert(!result.heroDegreesPresent, `The duplicate hero degree line is still visible at ${width}px.`);
    assert(JSON.stringify(result.designerLinks) === JSON.stringify(['tel:8095828114', 'mailto:manojkumarn858@gmail.com']), `Designer contact links are incorrect at ${width}px.`);
    assert(Math.abs(result.countdownExpectedSeconds - result.countdownActualSeconds) <= 1, `Countdown mismatch at ${width}px: ${result.countdownActual.join(':')} expected ${result.countdownExpected.join(':')}.`);
    assert(result.content.includes('Samskruthi Pavilion') && result.content.includes('Lagna: Dhanu'), `Venue or lagna details missing at ${width}px.`);
    assert(result.content.includes('Smt. Kumari & Sri Lokesh') && result.content.includes('Late Smt. Shambhamma & Late Sri Thimmarayappa'), `Compliment lines missing at ${width}px.`);
    assert(result.missingCopy.length === 0, `Supplied wedding information is missing at ${width}px: ${result.missingCopy.join(' | ')}`);
    assert(JSON.stringify(result.formalPrefixes) === JSON.stringify(['Chi. Ry.', 'Chi. Kum. Sou.']), `Formal prefixes changed in the wedding data at ${width}px.`);
    assert(result.calendarButtons.length === 4, `Expected four event calendar links at ${width}px, got ${result.calendarButtons.length}.`);
    assert(result.mapsHref?.startsWith('https://www.google.com/maps/search/?') && !result.mapsHref.includes('@'), 'Maps button must be a Maps search URL without fabricated coordinates.');
    assert(result.accessibility.h1Count === 1, `Expected one page h1 at ${width}px.`);
    assert(result.accessibility.imagesWithoutAlt.length === 0, `Image without alt attribute at ${width}px.`);
    assert(result.accessibility.linksWithoutName.length === 0, `Link without accessible name at ${width}px.`);
    assert(result.accessibility.musicHasLabel && result.accessibility.skipLink === '#main-content', `Music or skip navigation accessibility missing at ${width}px.`);
    assert(result.sectionsPresent, `A required wedding section is missing at ${width}px.`);
    assert(result.animationNames.petals === 'petal-fall' && result.animationNames.floralArch === 'arch-reveal' && result.animationNames.dividers === 'divider-bloom' && result.animationNames.countdown === 'count-number-change' && result.animationNames.sparkles === 'sparkle-glow', `A decorative, divider, or countdown animation is missing at ${width}px.`);
    assert(result.firstContentfulPaintMs !== null && result.firstContentfulPaintMs < 5_000, `First contentful paint exceeded 5 seconds at ${width}px.`);
    assert(result.resourcePayloadBytes < 1_200_000, `Initial page resources exceeded 1.2 MB at ${width}px.`);

    if (width === 1920 || width === 390) {
      const screenshot = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
      await writeFile(join(screenshotsDir, `invitation-${width}.png`), Buffer.from(screenshot.data, 'base64'));
    }

    if (width === 390) {
      await page.evaluate(`new Promise(resolve => setTimeout(resolve, Math.max(0, 3300 - performance.now())))`);
      const autoplayState = await page.evaluate(`({ attempted: document.querySelector('#wedding-music').dataset.autoplayAttempted === 'true', playing: !document.querySelector('#wedding-music').paused, error: document.querySelector('.music-control__label').textContent.includes('could not be played') })`);
      console.log(`Delayed autoplay: attempted=${autoplayState.attempted}, started=${autoplayState.playing}, browserRejected=${autoplayState.error}`);
      assert(autoplayState.attempted, 'The player did not attempt autoplay after three seconds.');
      if (autoplayState.playing) await page.evaluate(`document.querySelector('.music-control').click()`, { userGesture: true });
      await page.evaluate(`document.querySelector('.music-control').click()`, { userGesture: true });
      await new Promise((resolve) => setTimeout(resolve, 450));
      const musicStarted = await page.evaluate(`!document.querySelector('#wedding-music').paused && document.querySelector('.music-control').getAttribute('aria-pressed') === 'true'`);
      assert(musicStarted, 'Optional music did not start after the guest pressed Play.');
      await page.evaluate(`document.querySelector('.music-control').click()`, { userGesture: true });
      const musicStopped = await page.evaluate(`document.querySelector('#wedding-music').paused && document.querySelector('.music-control').getAttribute('aria-pressed') === 'false'`);
      assert(musicStopped, 'Optional music did not stop after the guest pressed Pause.');
      await page.evaluate(`document.querySelector('.button[href="#events"]').click()`);
      const anchorWorks = await page.evaluate(`location.hash === '#events' && !!document.getElementById('events')`);
      assert(anchorWorks, 'Hero wedding-details button does not navigate to the events section.');

      await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
      await new Promise((resolve) => setTimeout(resolve, 950));
      const reveals = await page.evaluate(`(() => { const garland = document.querySelector('.closing__garland'); return { sections: [...document.querySelectorAll('.motion-section')].map(node => getComputedStyle(node).opacity), closingGarlandAnimation: garland ? getComputedStyle(garland).animationName : 'missing' }; })()`);
      const closingShot = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
      await writeFile(join(screenshotsDir, 'invitation-closing-390.png'), Buffer.from(closingShot.data, 'base64'));
      assert(reveals.sections.every(opacity => Number(opacity) > 0.98), `Not all sections revealed after scrolling: ${reveals.sections.join(',')}`);
      assert(reveals.closingGarlandAnimation !== 'none', 'Closing garland animation did not run.');
    }
  }

  for (const file of ['/favicon.svg', '/audio/wedding-instrumental.mp3', '/audio/original-tanpura-drone.wav', '/calendar/reception.ics', '/calendar/muhurtham.ics']) {
    const response = await fetch(new URL(file, baseUrl));
    assert(response.ok, `${file} returned HTTP ${response.status}.`);
    console.log(`asset ${file}: HTTP ${response.status}, ${response.headers.get('content-type')}`);
  }
  const reception = await (await fetch(new URL('/calendar/reception.ics', baseUrl))).text();
  const muhurtham = await (await fetch(new URL('/calendar/muhurtham.ics', baseUrl))).text();
  assert(reception.includes('DTSTART;TZID=Asia/Kolkata:20261210T183000') && !reception.includes('DTEND'), 'Reception calendar has an incorrect start or invented end time.');
  assert(muhurtham.includes('DTSTART;TZID=Asia/Kolkata:20261211T075800') && muhurtham.includes('DTEND;TZID=Asia/Kolkata:20261211T085000'), 'Muhurtham calendar date/times are incorrect.');

  await page.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });
  await page.send('Page.navigate', { url: baseUrl });
  await new Promise((resolve) => setTimeout(resolve, 1_000));
  for (const [name, selector] of [['save-date', '#save-the-date'], ['couple', '#couple'], ['events', '#events'], ['venue', '#venue'], ['closing', '.closing-section']]) {
    await page.evaluate(`(() => { document.documentElement.style.scrollBehavior = 'auto'; document.querySelector('${selector}').scrollIntoView({ block: 'start' }); })()`);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const capture = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
    await writeFile(join(screenshotsDir, `section-${name}-390.png`), Buffer.from(capture.data, 'base64'));
  }

  await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await page.send('Page.navigate', { url: baseUrl });
  await new Promise((resolve) => setTimeout(resolve, 800));
  const reduced = await page.evaluate(`(() => { const garland = document.querySelector('.closing__garland'); const section = document.querySelector('.motion-section'); return { garlandDuration: garland ? getComputedStyle(garland).animationDuration : 'missing', scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior, hiddenSection: section ? getComputedStyle(section).opacity : 'missing' }; })()`);
  assert(reduced.scrollBehavior === 'auto', 'Reduced-motion setting did not disable smooth scrolling.');
  assert(reduced.hiddenSection === '1', 'Reduced-motion setting left a section hidden.');
  assert(consoleErrors.length === 0, `Browser console errors: ${consoleErrors.join(' | ')}`);
  assert(networkFailures.length === 0, `Network load failures: ${networkFailures.join(' | ')}`);
  console.log(JSON.stringify({ reducedMotion: reduced, consoleErrors, networkFailures, failures }));
} catch (error) {
  failures.push(error.message);
} finally {
  if (page?.socket) page.socket.close();
  if (browser?.pid) {
    spawnSync('taskkill.exe', ['/PID', String(browser.pid), '/T', '/F'], { stdio: 'ignore' });
    browser.kill();
  }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(profileDir, { recursive: true, force: true });
      break;
    } catch (error) {
      if (attempt === 4) console.warn(`Temporary Edge profile could not be removed: ${error.message}`);
      else await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
}

if (failures.length) {
  console.error(`QA FAILED (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`QA PASSED for ${viewports.join(', ')}px viewports.`);
}
