import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEOHead({ 
  title = "Fast Image Generator - World's #1 Fastest AI Image Generator",
  description = "Generate stunning AI images in seconds with the world's fastest image generator. Create professional-quality images from text prompts using advanced AI technology. Free to start!",
  keywords = "AI image generator, fast image generation, text to image, AI art, image creation, artificial intelligence, digital art, instant images",
  image = "/og-image.jpg",
  url = "https://mydesignnexus.in"
}: SEOHeadProps) {
  
  React.useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic SEO meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'MyDesignNexus');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    // Open Graph meta tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'Fast Image Generator', true);
    
    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Additional SEO tags
    updateMetaTag('theme-color', '#3B82F6');
    updateMetaTag('msapplication-TileColor', '#3B82F6');
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
    
    // JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Fast Image Generator",
      "description": description,
      "url": url,
      "applicationCategory": "DesignApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "MyDesignNexus",
        "url": "https://www.mydesignnexus.in"
      }
    };
    
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);
    
  }, [title, description, keywords, image, url]);

  return null;
}