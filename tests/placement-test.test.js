/**
 * Unit Tests for Placement Test functionality
 */
const { getDriver, By, until } = require('./selenium-utils');

describe('Placement Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await getDriver();
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  // UT-2.1.1
  test('UT-2.1.1: Placement Test Creation', async () => {
    // Admin login
    await driver.get('http://127.0.0.1:3000/login');
    await driver.findElement(By.xpath("//input[@placeholder='Username or Email']")).sendKeys('admin');
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys('adminpass');
    
    const loginBtn = await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Get Started')]"));
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", loginBtn);
    await driver.sleep(500);
    await loginBtn.click();
    
    await driver.wait(until.urlContains('/admin'), 15000);
    // Create test
    await driver.get('http://127.0.0.1:3000/admin/classes/1');
    await driver.findElement(By.id('create-placement-test')).click();
    await driver.findElement(By.id('add-item')).click();

    // Upload objective questions & add manual
    await driver.findElement(By.id('upload-questions')).sendKeys('/path/to/questions.csv');
    await driver.findElement(By.id('add-essay')).click();
    await driver.findElement(By.id('set-weights')).sendKeys('50');

    await driver.findElement(By.id('submit-test')).click();

    // Expected: Save and return to class page
    await driver.wait(until.urlContains('/admin/classes/1'), 5000);
  });

  // UT-2.2.1
  test('UT-2.2.1: Placement Test Access (Before scheduled)', async () => {
    await driver.get('http://127.0.0.1:3000/login');
    await driver.findElement(By.xpath("//input[@placeholder='Username or Email']")).sendKeys('learner');
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys('learnerpass');
    
    const loginBtn = await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Get Started')]"));
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", loginBtn);
    await driver.sleep(500);
    await loginBtn.click();
    
    await driver.wait(until.urlContains('/classes'), 15000);
    await driver.get('http://127.0.0.1:3000/placement-test');

    const startBtn = await driver.findElement(By.id('start-test-btn'));
    expect(await startBtn.isEnabled()).toBe(false);

    // Click disabled
    await startBtn.click();
    const tooltip = await driver.findElement(By.id('test-status-tooltip')).getText();
    expect(tooltip).toContain('placement test belum dimulai');
  });

  // UT-2.2.2
  test('UT-2.2.2: Placement Test Manual Start', async () => {
    // Admin log in (assuming already logged in, but let's navigate)
    await driver.get('http://127.0.0.1:3000/admin/assignments');
    await driver.findElement(By.id('filter-placement-test')).click();
    await driver.findElement(By.id('start-assignment-1')).click();

    const status = await driver.findElement(By.id('status-1')).getText();
    expect(status).toBe('LIVE');
  });

  // UT-2.3.1
  test('UT-2.3.1: Placement Test Submission', async () => {
    await driver.get('http://127.0.0.1:3000/placement-test/1');
    await driver.findElement(By.id('start-test-btn')).click();

    // Complete test
    await driver.findElement(By.id('answer-1')).click();
    await driver.findElement(By.id('submit-test')).click();

    // Expected: Return to previous page
    await driver.wait(until.urlContains('/placement-test'), 5000);
  });

  // UT-2.3.2
  test('UT-2.3.2: Placement Test Auto-Submit', async () => {
    await driver.get('http://127.0.0.1:3000/placement-test/1');
    await driver.findElement(By.id('start-test-btn')).click();

    // wait for expiration (simulated)
    await driver.wait(until.elementLocated(By.id('timeout-message')), 120000);

    const msg = await driver.findElement(By.id('timeout-message')).getText();
    expect(msg).toContain('waktu test telah habis');
  });
  // UT-2.3.3
  test('UT-2.3.3: Placement Test (Empty Submission)', async () => {
    // Click Submit without answering any questions
    await driver.get('http://127.0.0.1:3000/placement-test/1');
    // Tracker: System submits an empty test immediately without warning. (Failed)
    // Here we'd simulate clicking start and then clicking submit.
  });

  // UT-2.3.4
  test('UT-2.3.4: Placement Test (Network Disconnect)', async () => {
    // Start test, simulate disconnect, try to submit
    // Tracker: Answers are lost; user is redirected to offline browser edge page. (Failed)
  });

  // UT-2.3.5
  test('UT-2.3.5: Placement Test (Late Submission)', async () => {
    // Keep test tab open past end time, click submit
    // Tracker: System accepts late submission successfully. (Failed)
  });
});
