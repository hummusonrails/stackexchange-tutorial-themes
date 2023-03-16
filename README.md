# Tutorial Topics from StackExchange Questions

This is a Node.js app that retrieves recent questions from a StackExchange site and uses ChatGPT to analyze the questions for common themes. The app is designed to help generate ideas for tutorial and blog post content based on the topics that are currently popular on a particular StackExchange site.

## Installation
To use this app, you'll need to have Node.js installed on your machine. Once you have Node.js installed, you can clone the project from GitHub:

```
git clone https://github.com/bencgreenberg/stackexhange-tutorial-themes.git
```

After cloning the project, navigate to the project directory and install the required dependencies:

```
cd stackexhange-tutorial-themes
npm install
```

## Configuration

Before you can use the app, you'll need to set up a few configuration variables. These variables can be set using environment variables or a .env file.

### OpenAI API Key

The app uses the OpenAI API to analyze the questions and generate content ideas. To use the API, you'll need an API key from OpenAI. You can obtain an API key by creating an account on the OpenAI website.

Once you have an API key, you can set it as an environment variable or in a .env file. To set the API key as an environment variable, run the following command in your terminal:

```
export OPENAI_API_KEY=your-api-key
```

To set the API key in a .env file, create a new file named .env in the project directory and add the following line:

```
OPENAI_API_KEY=your-api-key
```

Replace your-api-key with your actual API key.

### StackExchange Site
The app is designed to work with a specific StackExchange site. You'll need to specify the site's API endpoint and other parameters in the index.js file. Specifically, you'll need to update the following lines of code:

```
const apiUrl = 'STACK EXCHANGE API ENDPOINT';
```

## Usage

To use the app, simply run the following command in your terminal:

```
npm start
```

The app will retrieve recent questions from the specified StackExchange site, analyze them using ChatGPT, and generate tutorial and blog post ideas based on the common themes. The results will be displayed in your terminal.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
