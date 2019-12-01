# Data mining project

This repository is the base for a data mining project. 

## Dataset

The dataset is provided by Yelp 2019 challenge and can be downloaded from [here](https://www.yelp.com/dataset). After downloading, extract the archive, rename the extracted file, adding __.tar__ at the end and extract again.

## 1-insert-data-to-mongo 📚

### About

A nodeJS script that parses the data, selects only businesses that have "restaurant" listed in the categories field and adds to a mongo database those business objects and all reviews for them.

If using the 2019 dataset, the script will add __59,387__ businesses (63 MB), and __4,201,890__ reviews (3,1 GB). The script is not optimized to run on multiple threads, it may take some time to add the reviews.

### Running the script

- Make sure you have nodejs and a mongodb instance installed
- `cd 1-insert-data-to-mongo`
- Modify the `/src/constants.js` file before running the script.
- `npm install`
- `npm start` or `node index.js`
- Be patient 😉