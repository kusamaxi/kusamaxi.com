<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8"/>
<xsl:template match="/">
<html>
<head>
  <title><xsl:value-of select="/rss/channel/title"/></title>
  <style>
    body {
      font-family: 'IBM Plex Serif', serif;
      line-height: 1.6;
      color: #27272a;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background-color: #fef1f2;
    }
    h1 {
      font-family: 'Space Grotesk', sans-serif;
      color: #be185d;
      border-bottom: 2px solid #be185d;
      padding-bottom: 0.5rem;
    }
    .feed-info {
      background: white;
      padding: 1.5rem;
      border: 2px solid #881337;
      box-shadow: 0.25rem 0.25rem 0 0 #881337;
      margin-bottom: 2rem;
    }
    .item {
      background: white;
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      border: 2px solid #881337;
      box-shadow: 0.25rem 0.25rem 0 0 #881337;
    }
    .item h2 {
      font-family: 'Space Grotesk', sans-serif;
      margin-top: 0;
    }
    .item a {
      color: #be185d;
      text-decoration: none;
    }
    .item a:hover {
      text-decoration: underline;
    }
    .date {
      color: #71717a;
      font-size: 0.9rem;
    }
    .subscribe {
      background: #be185d;
      color: white;
      padding: 0.5rem 1rem;
      text-decoration: none;
      display: inline-block;
      font-family: 'Space Grotesk', sans-serif;
      border: 2px solid #881337;
      box-shadow: 0.25rem 0.25rem 0 0 #881337;
    }
  </style>
</head>
<body>
  <h1><xsl:value-of select="/rss/channel/title"/></h1>
  <div class="feed-info">
    <p><xsl:value-of select="/rss/channel/description"/></p>
    <p><a class="subscribe" href="{/rss/channel/link}">Visit Website</a></p>
    <p>Subscribe to this feed by copying this URL into your RSS reader:</p>
    <code><xsl:value-of select="/rss/channel/link"/>rss.xml</code>
  </div>
  <xsl:for-each select="/rss/channel/item">
    <div class="item">
      <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
      <p class="date"><xsl:value-of select="pubDate"/></p>
      <p><xsl:value-of select="description"/></p>
    </div>
  </xsl:for-each>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
