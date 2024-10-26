# DOM 

This is a Supabase Edge Function that supports the registration of Scr88 site. Main purpose of the function is to validate passed values such as URL, CSS selectors, regular expressions to work against passed URL. 

## Features

- URL validation
- Text and link extraction
- Regular expression matching
- Last page number extraction for pagination

## Endpoints

The function exposes the following endpoints:

- `/url`: Validate a URL
- `/regex`: Apply a regular expression to the DOM
- `/extract`: Extract specific elements from the DOM
- `/lastPageNumber`: Extract the last page number from a paginated list

## Installation

1. Clone this repository
2. Install the Supabase CLI
3. Run `supabase init` in your project directory
4. Deploy the function using `supabase functions deploy dom`

## Development

To run the function locally:

1. Start your Supabase project: `supabase start`
2. Run the function: `supabase functions serve dom`

## Usage

To use this API, send POST requests to the appropriate endpoints. All endpoints are accessed via `https://your-project.supabase.co/functions/v1/dom/[endpoint]`.

### 1. /url

Validates if a given URL is reachable.

**Input:**

~~~json
{
  "url": "https://example.com"
}
~~~

**Return Value:**

~~~json
{
  "err": null,
  "data": {
    "url": "https://example.com"
  }
}
~~~

If the URL is invalid or unreachable, `err` will contain an error message and `data` will be `null`.

### 2. /regex

Applies a regular expression to a string extracted from a given URL using passed CSS selector.

**Input:**

~~~json
{
  "url": "https://example.com",
  "selector": "your-regex-pattern",
  "regex": "your-regex-pattern"
}
~~~

**Return Value:**

~~~json
{
  "err": null,
  "data": "matched-string"
}
~~~

If the regex doesn't match or is invalid, `err` will contain an error message and `data` will be `null`.

### 3. /extract

Extracts specific elements from the DOM of a given URL.

**Input:**

~~~json
{
  "url": "https://example.com",
  "selector": "css-selector",
  "type": "link" | "text" | "node" | "links" | "texts" | "nodes"
}
~~~

**Return Value:**

~~~json
{
  "err": null,
  "data": "extracted-content" | ["array", "of", "extracted", "content"]
}
~~~
Use "text","link","node" for single extractions and "links","texts","nodes" for multiple extractions.

"text" and "texts" return element.textContent.  "link" and "links" return element.getAttribute("href").  "node" and "nodes" return element.outerHTML.

### 4. /lastPageNumber

Extracts the last page number from a paginated list on a given URL.

**Input:**

~~~json
{
  "url": "https://example.com",
  "selector": "css-selector-for-last-page-link",
  "regex": "regex-to-extract-page-number-within-url"
}
~~~

**Return Value:**

~~~json
{
  "err": null,
  "data": "last-page-number"
}
~~~

If the extraction fails, `err` will contain an error message and `data` will be `null`.

For all endpoints, if there's an error, the response will have a non-null `err` field with an error message, and `data` will be `null`.

## License

This project is licensed under the [MIT License](LICENSE).
