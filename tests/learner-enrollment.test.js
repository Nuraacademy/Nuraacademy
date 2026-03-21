/**
 * Unit Tests for Learner Enrollment
 */
const { getDriver, By, until } = require('./selenium-utils');

describe('Learner Enrollment', () => {
  let driver;

  beforeAll(async () => {
    driver = await getDriver();
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  // UT-1.3.1
  test('UT-1.3.1: Learner Enrollment Form', async () => {
    // Requires pre-existing login and specific class
    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.xpath("//input[@placeholder='Username or Email']")).sendKeys('existinguser');
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys('password123');
    
    const loginBtn = await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Get Started')]"));
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", loginBtn);
    await driver.sleep(500);
    await loginBtn.click();
    
    await driver.wait(until.urlContains('/classes'), 20000);
    
    // Go to an enrollment page directly for a mock class ID, say 1
    await driver.get('http://localhost:3000/classes/1/enrollment');
    
    // Fill enrollment form using placeholders
    await driver.findElement(By.xpath("//input[@placeholder='Profession']")).sendKeys('Software Engineer');
    await driver.findElement(By.xpath("//input[@placeholder='YoE (Years of Experience)']")).sendKeys('5');
    await driver.findElement(By.xpath("//input[@placeholder='Work Field']")).sendKeys('Tech');
    await driver.findElement(By.xpath("//input[@placeholder='Education Field']")).sendKeys('Computer Science');
    await driver.findElement(By.xpath("//input[@placeholder='Job Industry']")).sendKeys('IT');
    await driver.findElement(By.xpath("//textarea[@placeholder='Final expectations']")).sendKeys('Practical experience');
    
    // Select an objective chip
    const chipBtn = await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Upskilling')]"));
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", chipBtn);
    await driver.sleep(500);
    await chipBtn.click();

    // The CV upload
    const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
    await fileInput.sendKeys('/tmp/dummy.pdf');
    
    const submitBtn = await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Submit')]"));
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", submitBtn);
    await driver.sleep(500);
    await submitBtn.click();
    
    // Expected: Redirect to payment page with timeline pop-up (mocking success)
    await driver.wait(until.urlContains('/payment'), 20000);
  });
});
