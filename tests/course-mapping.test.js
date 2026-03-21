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

  // UT-1.7.1
  test('UT-1.7.1: Course Mapping (Automatic)', async () => {
    // Learner completes objective placement test
    await driver.get('http://localhost:3000/learner/courses');
    
    // Verify a course is marked passed
    const courseStatus = await driver.findElement(By.id('course-1-status')).getText();
    expect(courseStatus).toBe('passed');
    
    // Ensure excluded from mandatory
    const isMandatory = await driver.findElements(By.id('course-1-mandatory'));
    expect(isMandatory.length).toBe(0); // Should not exist
  });

  // UT-1.7.2
  test('UT-1.7.2: Course Mapping (Manual)', async () => {
    // Trainer log in
    await driver.get('http://localhost:3000/trainer/results');
    await driver.findElement(By.id('learner-1')).click();
    
    await driver.findElement(By.id('essay-score-input')).sendKeys('85');
    await driver.findElement(By.id('submit-scores-btn')).click();
    
    // Verify final total calculated
    await driver.wait(until.elementLocated(By.id('final-total')), 5000);
    const finalTotal = await driver.findElement(By.id('final-total')).getText();
    expect(parseFloat(finalTotal)).toBeGreaterThan(0);
  });
});
