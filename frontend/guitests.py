import unittest
import os, sys

from selenium import webdriver


# defult is for linux.
# browser = webdriver.Chrome(executable_path='./testsHelperFiles/chromedriver')
# browser = webdriver.Chrome(executable_path='./testsHelperFiles/chromedriverMac')

# browser.get('http://seleniumhq.org/')


class E2ETests(unittest.TestCase):
    def setUp(self):
        caps = {"browserName": "chrome"}
        self.browser = webdriver.Remote(
            command_executor=f'http://{os.getenv("HUB_HOST")}:{os.getenv("HUB_PORT")}/wd/hub',
            # command_executor='http://selenium-hub:4444/wd/hub',
            desired_capabilities=caps,
        )
        self.browser.implicitly_wait(30)
        self.addCleanup(self.browser.quit)

    ## ensure the page loads
    def test_page_title(self):
        self.browser.get("http://frontend:3000")
        self.assertIsNotNone(self.assertIn("Costly Commute", self.browser.title))

    def test_splash_page(self):
        self.browser.get("http://frontend:3000")
        self.assertIsNotNone(self.browser.find_element_by_id("welcomePage"))

    def test_home_cards(self):
        self.browser.get("http://frontend:3000/Model?type=Homes")
        self.assertIsNotNone(self.browser.find_element_by_id("cardHolder"))

    def test_commute_cards(self):
        self.browser.get("http://frontend:3000/Model?type=Commutes")
        self.assertIsNotNone(self.browser.find_element_by_id("cardHolder"))

    def test_city_cards(self):
        self.browser.get("http://frontend:3000/Model?type=Cities")
        self.assertIsNotNone(self.browser.find_element_by_id("cardHolder"))

    def testForm(self):
        self.browser.get("http://frontend:3000/Model?type=Homes")
        self.assertIsNotNode(self.browser.find_element_by_id("toggleFormButton"))

    def testNaviHeader(self):
        self.browser.get("http://frontend:3000/Model?type=Homes")
        self.assertIsNotNone(self.browser.find_element_by_id("Navi"))

    def query_button_exists_on_commutes(self):
        self.browser.get("http://frontend:3000/Model?type=Commutes")
        self.assertIsNotNone(self.browser.find_element_by_id("toggleFormButton"))

    def query_button_exists_on_cities(self):
        self.browser.get("http://frontend:3000/Model?type=Cities")
        self.assertIsNotNone(self.browser.find_element_by_id("toggleFormButton"))

    def query_button_exists_on_homes(self):
        self.browser.get("http://frontend:3000/Model?type=Homes")
        self.assertIsNotNone(self.browser.find_element_by_id("toggleFormButton"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
