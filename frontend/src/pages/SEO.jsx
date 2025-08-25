import { Helmet } from "react-helmet-async";

function SEO({ title, description, image }) {
  const siteTitle = "Erino Leads";
  const defaultDescription = "Manage your leads effectively";
  const defaultImage = "/logo.png";

  return (
    <Helmet>
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content="https://erino-leads.shobhittiwari.me/" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      <link rel="canonical" href="https://erino-leads.shobhittiwari.me/" />
    </Helmet>
  );
}

export default SEO;