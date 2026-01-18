<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - FibercableDeals</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            padding: 40px 20px;
            color: #333;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #2b6cff 0%, #1e4fc2 100%);
            border-radius: 16px 16px 0 0;
            padding: 30px 40px;
            color: white;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
          }
          .header p {
            opacity: 0.9;
            font-size: 14px;
          }
          .stats {
            display: flex;
            gap: 30px;
            margin-top: 20px;
          }
          .stat-box {
            background: rgba(255,255,255,0.15);
            padding: 12px 20px;
            border-radius: 8px;
          }
          .stat-box span {
            display: block;
            font-size: 12px;
            opacity: 0.8;
            text-transform: uppercase;
          }
          .stat-box strong {
            font-size: 24px;
          }
          .content {
            background: #fff;
            border-radius: 0 0 16px 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background: #f8f9fa;
            padding: 15px 20px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            color: #666;
            border-bottom: 2px solid #e9ecef;
          }
          td {
            padding: 15px 20px;
            border-bottom: 1px solid #f1f3f4;
          }
          tr:hover {
            background: #f8f9ff;
          }
          tr:last-child td {
            border-bottom: none;
          }
          .url-link {
            color: #2b6cff;
            text-decoration: none;
            font-weight: 500;
          }
          .url-link:hover {
            text-decoration: underline;
          }
          .priority {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .priority-high {
            background: #d4edda;
            color: #155724;
          }
          .priority-medium {
            background: #fff3cd;
            color: #856404;
          }
          .priority-low {
            background: #f8d7da;
            color: #721c24;
          }
          .changefreq {
            color: #666;
            font-size: 13px;
          }
          .date {
            color: #888;
            font-size: 13px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: rgba(255,255,255,0.6);
            font-size: 13px;
          }
          .footer a {
            color: #FFB302;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌐 XML Sitemap</h1>
            <p>This sitemap contains all the URLs for FibercableDeals website</p>
            <div class="stats">
              <div class="stat-box">
                <span>Total URLs</span>
                <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
              </div>
              <div class="stat-box">
                <span>Last Updated</span>
                <strong>Jan 2026</strong>
              </div>
            </div>
          </div>
          <div class="content">
            <table>
              <tr>
                <th>URL</th>
                <th>Priority</th>
                <th>Change Freq</th>
                <th>Last Modified</th>
              </tr>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a class="url-link" href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority &gt;= 0.8">
                        <span class="priority priority-high"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority &gt;= 0.5">
                        <span class="priority priority-medium"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority priority-low"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td class="changefreq"><xsl:value-of select="sitemap:changefreq"/></td>
                  <td class="date"><xsl:value-of select="sitemap:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </table>
          </div>
          <div class="footer">
            Generated for <a href="https://fibercabledeals.com">FibercableDeals.com</a>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
