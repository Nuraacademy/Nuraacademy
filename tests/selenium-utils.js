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
  await driver.get('http://127.0.0.1:3000/login');
  await driver.findElement(By.id('username')).sendKeys(username);
  await driver.findElement(By.id('password')).sendKeys(password);
  await driver.findElement(By.id('login-btn')).click();
  await driver.wait(until.urlContains('/classes'), 10000);
}

async function waitForElement(driver, locator, timeout = 10000) {
  await driver.wait(until.elementLocated(locator), timeout);
  const element = await driver.findElement(locator);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}

async function click(driver, elementOrLocator) {
  let element = elementOrLocator;
  if (elementOrLocator instanceof By || typeof elementOrLocator === 'object' && elementOrLocator.using) {
    element = await waitForElement(driver, elementOrLocator);
  }
  await driver.executeScript("arguments[0].scrollIntoView(true);", element);
  await element.click();
}

async function type(driver, elementOrLocator, text) {
  let element = elementOrLocator;
  if (elementOrLocator instanceof By || typeof elementOrLocator === 'object' && elementOrLocator.using) {
    element = await waitForElement(driver, elementOrLocator);
  }
  await element.clear();
  await element.sendKeys(text);
}

module.exports = {
  getDriver,
  login,
  waitForElement,
  click,
  type,
  By,
  until
};
