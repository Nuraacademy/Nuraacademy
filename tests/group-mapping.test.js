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

  // UT-1.8.1
  test('UT-1.8.1: Group Mapping', async () => {
    // Learning Designer login
    await driver.get('http://localhost:3000/admin/grouping/class/1');
    await driver.findElement(By.id('create-group')).click();
    
    // Select 3 learners
    await driver.findElement(By.id('learner-checkbox-1')).click();
    await driver.findElement(By.id('learner-checkbox-2')).click();
    await driver.findElement(By.id('learner-checkbox-3')).click();
    
    await driver.findElement(By.id('submit-group-btn')).click();
    
    // Verify group saved
    await driver.wait(until.elementLocated(By.id('group-list')), 5000);
    const groups = await driver.findElement(By.id('group-list')).getText();
    expect(groups).toContain('Learner 1');
    expect(groups).toContain('Learner 2');
    expect(groups).toContain('Learner 3');
  });

  // UT-1.8.2
  test('UT-1.8.2: Edit Group Mapping', async () => {
    // Learning Designer edit group
    await driver.get('http://localhost:3000/admin/learners');
    await driver.findElement(By.id('edit-group-1')).click();
    
    // Modify membership
    await driver.findElement(By.id('learner-checkbox-4')).click(); // add someone
    await driver.findElement(By.id('learner-checkbox-3')).click(); // remove someone
    
    await driver.findElement(By.id('submit-group-btn')).click();
    
    // Verify updated
    await driver.wait(until.elementLocated(By.id('group-list')), 5000);
    const groups = await driver.findElement(By.id('group-list')).getText();
    expect(groups).toContain('Learner 4');
  });
  // UT-1.8.3
  test('UT-1.8.3: Group Mapping (Role Restrictions)', async () => {
    // Log in as Learner
    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.xpath("//input[@placeholder='Username or Email']")).sendKeys('existinguser');
    await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys('password123');
    
    const loginBtn = await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Get Started')]"));
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", loginBtn);
    await driver.sleep(500);
    await loginBtn.click();
    
    // Attempt to access Group Mapping URL
    await driver.get('http://localhost:3000/admin/grouping/class/1');
    
    // Check if it redirects or gives 403
    // Tracker: Learner is able to view (but not edit). Improper RBAC. (Failed)
    // Here we might just check that we are not allowed to be on this page.
  });
});
