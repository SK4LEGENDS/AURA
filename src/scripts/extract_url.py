import sys
import json
import trafilatura

def extract_content(url):
    try:
        downloaded = trafilatura.fetch_url(url)
        if downloaded is None:
            return json.dumps({"error": "Failed to fetch URL"})
        
        result = trafilatura.extract(downloaded, include_comments=False, include_tables=False, no_fallback=False)
        
        if result:
            return json.dumps({"text": result})
        else:
            return json.dumps({"error": "Could not extract content"})
            
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No URL provided"}))
        sys.exit(1)
        
    url = sys.argv[1]
    print(extract_content(url))
