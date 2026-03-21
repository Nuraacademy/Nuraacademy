/**
 * Unit Tests for Group Mapping
 */
const { getDriver, By, until } = require('./selenium-utils');

describe('Group Mapping', () => {
  let driver;

  beforeAll(async () => {
    driver = await getDriver();
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  // UT-3.2.1: Group Mapping
  test('UT-3.2.1: Group Mapping', async () => {
    // Learning Designer login
    await driver.get('http://127.0.0.1:3000/login');
    await driver.findElement(By.xpath("//input[@placeholder='Username or Email']")).sendKeys('designer_user');
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys('password');
    await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Get Started')]")).click();
    
    // Navigate to grouping page
    await driver.get('http://127.0.0.1:3000/classes/1/placement/learner-group');
    
    // Create new group
    const groupNameInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='New group name']")), 10000);
    await groupNameInput.sendKeys('Test Group A');
    await driver.findElement(By.xpath("//button[contains(text(), 'Create Group')]")).click();
    
    // Assign learner to group (assuming dropdown exists)
    const select = await driver.wait(until.elementLocated(By.xpath("//select")), 10000);
    await select.sendKeys('Test Group A');
    
    await driver.findElement(By.xpath("//button[contains(text(), 'Save Assignments')]")).click();
    
    // Verify success toast/redirection
    await driver.wait(until.elementLocated(By.xpath("//li[@data-sonner-toast]")), 5000);
  });

  // UT-3.2.2: Edit Group Mapping
  test('UT-3.2.2: Edit Group Mapping', async () => {
    // Learning Designer login
    await driver.get('http://127.0.0.1:3000/login');
    await driver.findElement(By.xpath("//input[@placeholder='Username or Email']")).sendKeys('designer_user');
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys('password');
    await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Get Started')]")).click();
    
    await driver.get('http://127.0.0.1:3000/classes/1/placement/learner-group');
    
    // Modify existing group assignment
    const select = await driver.wait(until.elementLocated(By.xpath("//select")), 10000);
    await select.sendKeys('Unassigned'); // Change from Group A back to Unassigned
    
    await driver.findElement(By.xpath("//button[contains(text(), 'Save Assignments')]")).click();
    
    await driver.wait(until.elementLocated(By.xpath("//li[@data-sonner-toast]")), 5000);
  });

  // UT-3.2.3: Group Mapping (Role Restrictions)
  test('UT-3.2.3: Group Mapping (Role Restrictions)', async () => {
    // Log in as standard Learner
    await driver.get('http://127.0.0.1:3000/login');
    await driver.findElement(By.xpath("//input[@placeholder='Username or Email']")).sendKeys('testlearner');
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys('password');
    await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Get Started')]")).click();
    
    // Attempt to access Group Mapping URL directly
    await driver.get('http://127.0.0.1:3000/classes/1/placement/learner-group');
    
    // Check if it redirects or shows unauthorized (Expected: 403 or redirect to Dashboard)
    // If user is redirected to dashboard, URL will change
    await driver.wait(until.urlContains('/dashboard') || until.urlContains('/overview'), 10000);
    expect(await driver.getCurrentUrl()).not.toContain('/placement/learner-group');
  });
});
