/**
 * Unit Tests for Course Mapping
 */
const { getDriver, By, until } = require('./selenium-utils');

describe('Course Mapping', () => {
  let driver;

  beforeAll(async () => {
    driver = await getDriver();
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  // UT-3.1.1: Automatic Course Mapping
  test('UT-3.1.1: Automatic Course Mapping', async () => {
    // 1. Visit LMS site as learner
    await driver.get('http://127.0.0.1:3000/login');
    await driver.findElement(By.xpath("//input[@placeholder='Username or Email']")).sendKeys('testlearner');
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys('password');
    await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Get Started')]")).click();
    
    // 2. Complete objective placement test (assuming redirected or navigate)
    // Here we just verify the result page shows "Passed"
    await driver.get('http://127.0.0.1:3000/classes/1/test?finished=true');
    
    // Verify "Passed" indicator exists
    const passIndicator = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Passed')]")), 10000);
    expect(await passIndicator.isDisplayed()).toBe(true);
  });

  // UT-3.1.2: Manual Grading
  test('UT-3.1.2: Manual Grading', async () => {
    // Trainer log in
    await driver.get('http://127.0.0.1:3000/login');
    await driver.findElement(By.xpath("//input[@placeholder='Username or Email']")).sendKeys('trainer_user');
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys('password');
    await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Get Started')]")).click();
    
    // Navigate to manual grading page
    await driver.get('http://127.0.0.1:3000/classes/1/placement/results/1/grade');
    
    // Input scores for essay/project
    const scoreInputs = await driver.findElements(By.xpath("//input[@type='number']"));
    for (let input of scoreInputs) {
      await input.clear();
      await input.sendKeys('80');
    }
    
    await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Submit Grade')]")).click();
    
    // Verify redirection back to results/overview
    await driver.wait(until.urlContains('/results'), 10000);
    expect(await driver.getCurrentUrl()).toContain('/results');
  });

  // UT-3.1.3: Course Mapping (Invalid Weight)
  test('UT-3.1.3: Course Mapping (Invalid Weight)', async () => {
    // Login as Designer to edit test configuration
    await driver.get('http://127.0.0.1:3000/login');
    await driver.findElement(By.xpath("//input[@placeholder='Username or Email']")).sendKeys('designer_user');
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys('password');
    await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Get Started')]")).click();
    
    // Navigate to Create/Edit Test
    await driver.get('http://127.0.0.1:3000/classes/1/test/create');
    
    // Open course editor
    const addItemBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Add Item') or contains(text(), 'Edit')]")), 10000);
    await addItemBtn.click();
    
    // Input invalid "Passing Grade" (Threshold)
    const thresholdInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='e.g. 80']")), 10000);
    await thresholdInput.clear();
    await thresholdInput.sendKeys('1000'); // Assuming max is much lower
    
    // Check for validation error: "Cannot exceed max score"
    const errorMsg = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Cannot exceed max score')]")), 5000);
    expect(await errorMsg.isDisplayed()).toBe(true);
  });
});
