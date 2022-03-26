import scrapy
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

class SkillsFutureSpider(scrapy.Spider):
    name = "sf_spider"

    start_urls = [
        "https://www.skillsfuture.gov.sg/skills-framework/",
    ]

    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    def parse(self, response):
        # Step 1: Retrieve a List of each sector's framework_url
        sectors = response.xpath('//div[contains(@class,"section-framework-5")]/div[3]/ul/li')

        framework_urls = []
        for sector in sectors:
            # Retrieve sector's name and sector's framework url
            sector_name = sector.xpath('./div/h5/text()').get()

            # print(sector_name)
            framework_urls.append( sector.xpath('./div/div/a[1]/@href').get() ) # append selector object

        # for url in framework_urls:
        #     # Visit URL using Selenium Driver
        #     self.driver.get( url )

        url = "https://www.skillsfuture.gov.sg/skills-framework/ict#skillsframeworktemplates"
        
        self.driver.get( url )

        self.driver.find_element_by_xpath("//label[@for='jobadvertisement']").click()

        # Get all occupations <div> in the page
        self.driver.implicitly_wait(5)
        occupations = self.driver.find_elements_by_xpath("//form[@action='/skillsfuture/SkillsFramework/DownloadTemplates']//h3[contains(@class, 'ui-accordion-header')]")
        print(occupations)
        for occupation in occupations:
            print(occupation)
            
            occupation.click()


        self.driver.close()
    #     # Step 3: Navigate to next page using Arrow Next Button
    #     next_page = response.xpath('//div[@class="pagination"]/ul/li[@class="arrow next"]/a/@href').get()
    #     if next_page is not None:
    #         yield response.follow(next_page, callback = self.parse)

    # def scrape_sector_docs(self, response):
        # Step 1: Retrieve topic title at top of page
        # topic_title = response.xpath('//div[@class="page-body"]//h2[@class="topic-title"]/a/text()').get()

    #     # Step 2: Scrape post's details
    #     for post in response.xpath('//div[contains(@class,"post has-profile")]/div'):
    #         # instantiate item
    #         item = PostItem()

    #         # populate fields and store item
    #         item['topic_title'] = topic_title
    #         item['author_name'] = post.xpath('./dl/dt/a/text()').get()
    #         item['content'] = remove_tags( post.xpath('normalize-space( ./div[@class="postbody"]/div/div[@class="content"] )').get() ) # removes html tags and escape sequences

    #         yield item


    #     # Step 3: Navigate to next page using Arrow Next Button
    #     next_page = response.xpath('//div[@class="pagination"]/ul/li[@class="arrow next"]/a/@href').get()
    #     if next_page is not None:
    #         yield response.follow(next_page, callback = self.parse_posts)