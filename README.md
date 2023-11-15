# Caraffe-filtranti

Project based on Create React App to showcase a list of water filtering pitchers, fetched from a local JSON file. 

- Every pitcher refers to another local JSON file, updated from Amazon APIs every now and then to avoid too many requests, where there's all data related to every single product like ISIN code, name, pictures, rating, link. 
- After selecting one pitcher, the app scans another JSON file for compatible filters and shows them with their characteristics. 
- Finally, when a pitcher and a filter are selected, the user can interact with two sliders, one for the daily water consumption and another for the cost of bottled mineral water for comparison. Based on the chosen filter and the water consumption, the user will get a yearly estimate based on the number of filter will be needed, plus of course the cost of the pitcher itself.
