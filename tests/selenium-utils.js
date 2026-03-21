/**
 * Utility functions for Selenium WebDriver
 * Placeholder implementation for the test framework
 */

const { Builder, By, until } = require('selenium-webdriver');

async function getDriver() {
  // Setup standard chrome driver
  let driver = await new Builder().forBrowser('chrome').build();
  return driver;
}

async function login(driver, username, password) {
  await driver.get('http://localhost:3000/login');
  await driver.findElement(By.id('username')).sendKeys(username);
  await driver.findElement(By.id('password')).sendKeys(password);
  await driver.findElement(By.id('login-btn')).click();
  await driver.wait(until.urlContains('/member'), 5000);
}

module.exports = {
  getDriver,
  login,
  By,
  until
};
