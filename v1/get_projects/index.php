<?php
header('Content-type: text/json');

class ProjectImage {
    public $url = '';
	public $tnUrl = '';
	public $caption = '';
 
	public function __construct($url, $tnUrl, $caption) {
        if (is_string($url)) {
			$this->url = $url;
		}
        if (is_string($tnUrl)) {
			$this->tnUrl = $tnUrl;
		}
        if (is_string($caption)) {
			$this->caption = $caption;
		}
    }
}

class ProjectVideo {
    public $type = '';
	public $id = '';
	public $width = 640;
	public $height = 360;
 
	public function __construct($type, $id, $width, $height) {
        if (is_string($type)) {
			$this->type = $type;
		}
        if (is_string($id)) {
			$this->id = $id;
		}
        if (is_int($width)) {
			$this->width = $width;
		}
        if (is_int($height)) {
			$this->height = $height;
		}
	}
}

class ProjectLink {
    public $url = '';
	public $label = '';
    public $icon = 'link';
 
	public function __construct($url, $label, $icon) {
        if (is_string($url)) {
			$this->url = $url;
		}
        if (is_string($label)) {
			$this->label = $label;
		}
        if (is_string($icon)) {
			$this->icon = $icon;
		}
    }
}

class Project {
    public $id = null;
	public $title = null;
	public $desc = null;
	public $circa = null;
	public $tags = array();
	public $images = array();
	public $videos = array();
	public $altGrid = false;

    public function __construct($id, $title, $desc, $circa, $tags, $images, $videos, $altGrid) {
        if (is_string($id)) {
			$this->id = $id;
		}
        if (is_string($title)) {
			$this->title = $title;
		}
        if (is_string($desc)) {
			$this->desc = $desc;
		}
        if (is_string($circa)) {
			$this->circa = $circa;
		}
        if (is_array($tags)) {
			$this->tags = $tags;
		}
        if (is_array($images)) {
			$this->images = $images;
		}
        if (is_array($videos)) {
			$this->videos = $videos;
		}
		if (is_bool($altGrid) && $altGrid) {
			$this->altGrid = true;
		}
    }
}

class Response {
	public $total = 0;
	public $start = 0;
	public $end = 0;
	public $items = array();

    public function __construct($total, $start, $end, $items) {
        if (is_int($total)) {
			$this->total = $total;
		}
        if (is_int($start)) {
			$this->start = $start;
		}
        if (is_int($end)) {
			$this->end = $end;
		}
        if (is_array($items)) {
			$this->items = $items;
		}
    }	
}

$projects = array();

$projects[] = new Project(
	"collabspaceDownloader",
	"Collabware - Collabspace Export Downloader",
	"<p>The Collabspace Export Downloader is a desktop application that enables users to securely download and manage Collabspace exports across multiple regions.</p>"
		. "<p>Users can pause, resume, or cancel downloads with state persistence across restarts, while progress tracking displays real-time status. Deep linking through magnet link protocols allows users to initiate downloads directly from external sources like email or Teams.</p>"
		. "<p>Built on .NET 9 and MAUI 9, the downloader emphasizes accessibility with WCAG 2.2 Level AA compliance, including keyboard navigation and screen reader support. It offers four-language localization and integrated auto-update management.</p>"
		. "<p>The timeline for this project was extremely short and the application was planned, developed, and tested by myself leveraging Claude Code within the span of a month.</p>",
	"Winter 2025",
	array(".NET 9", ".NET MAUI", "C#", "Reqnroll", "xUnit", "Selenium", "Gherkin", "Claude Code"),
	array(
		new ProjectImage("/img/gallery/csDownload/download-light.png", "/img/gallery/csDownload/download-light_tn.png", "Export Downloader - Download Progress (Light Mode)"),
		new ProjectImage("/img/gallery/csDownload/download-dark.png", "/img/gallery/csDownload/download-dark_tn.png", "Export Downloader - Download Progress (Dark Mode)"),
		new ProjectImage("/img/gallery/csDownload/autoupdate.png", "/img/gallery/csDownload/autoupdate_tn.png", "Export Downloader - Auto-Update Dialog"),
		new ProjectImage("/img/gallery/csDownload/settings.png", "/img/gallery/csDownload/settings_tn.png", "Export Downloader - Settings")
	),
	array(),
	false
);

$projects[] = new Project(
	"collabspace",
	"Collabware - Collabspace",
	"<p>Collabspace is a FedRAMP certified cloud-based records management automation solution that automates compliance activities to meet legislative and regulatory requirements.</p>"
		. "<p>The platform uses a no-code visual workflow system for designing retention and lifecycle policies, supporting both time and event-based retention with metadata-driven calculations.</p>"
		. "<p>It handles both electronic content (email, structured and unstructured data) and physical records with inventory control, circulation tracking, container management, and barcode capabilities.</p>"
		. "<p>Collabspace supports multi-stage disposition review processes to authorize record destruction, with event-based triggers for retention and disposition.</p>",
	"Fall 2017 - Present",
	array(".NET 8", "C#", "React.js", "Fluent UI", "JointJS+", "Kubernetes", "SQL Server", "CosmosDB", "Azure Cloud Services"),
	array(
		new ProjectImage("/img/gallery/collabspace/analytics.jpg", "/img/gallery/collabspace/analytics_tn.png", "Collabspace - Analytics"),
		new ProjectImage("/img/gallery/collabspace/email-preview.jpg", "/img/gallery/collabspace/email-preview_tn.png", "Collabspace - Email Previews with Thread Navigation"),
		new ProjectImage("/img/gallery/collabspace/workflow-designer.jpg", "/img/gallery/collabspace/workflow-designer_tn.png", "Collabspace - Visual Workflow Designer"),
		new ProjectImage("/img/gallery/collabspace/document-preview.jpg", "/img/gallery/collabspace/document-preview_tn.png", "Collabspace - Document Preview with OCR"),
		new ProjectImage("/img/gallery/collabspace/aggregate-designer.png", "/img/gallery/collabspace/aggregate-designer_tn.png", "Collabspace - Aggregate Schema Designer"),
		new ProjectImage("/img/gallery/collabspace/search-designer.jpg", "/img/gallery/collabspace/search-designer_tn.png", "Collabspace - Advanced Search Builder"),
		new ProjectImage("/img/gallery/collabspace/fileplan.jpg", "/img/gallery/collabspace/fileplan_tn.png", "Collabspace - File Plan and Compliance Policy"),
		new ProjectImage("/img/gallery/collabspace/physicallibrary.jpg", "/img/gallery/collabspace/physicallibrary_tn.png", "Collabspace - Physical Records Library")
	),
	array(),
	false
);

$projects[] = new Project(
	"collabmail",
	"Collabware - Collabmail",
	"<p>Collabmail is a Microsoft Outlook add-in that integrates SharePoint directly into Outlook, providing drag-and-drop functionality for filing emails and attachments to SharePoint without switching applications. It supports SharePoint Server and SharePoint Online, allowing users to access libraries, view content, folders and metadata from their inbox.</p>"
		. "<p>Users can drag and drop emails, attachments, or both to SharePoint in bulk, and can also add SharePoint content to emails as attachments or links. Collabmail ensures compliance by prompting users to provide required metadata when filing content, a feature unavailable in standard Outlook, with bulk editing capabilities to reduce repetitive data entry.</p>"
		. "<p>Additional features include SharePoint file search from Outlook, automatic email metadata capture, and a favorites list for quick library access.</p>",
	"Summer 2016 - Present",
	array("Outlook", "SharePoint Server", "SharePoint Online", "ASP.Net", "C#", "WPF", "XSLT"),
	array(
		new ProjectImage("/img/gallery/collabmail/attachment-add.png", "/img/gallery/collabmail/attachment-add_tn.png", "Collabmail - Add Attachments or Shared Links from SharePoint"),
		new ProjectImage("/img/gallery/collabmail/drag-and-drop.png", "/img/gallery/collabmail/drag-and-drop_tn.png", "Collabmail - Drag-and-drop Documents from Windows into SharePoint"),
		new ProjectImage("/img/gallery/collabmail/edit-metadata2.png", "/img/gallery/collabmail/edit-metadata2_tn.png", "Collabmail - Update SharePoint content metadata right within Outlook"),
		new ProjectImage("/img/gallery/collabmail/search.png", "/img/gallery/collabmail/search_tn.png", "Collabmail - Navigate and Search for Sharepoint content within Outlook")
	),
	array(),
	false
);

$projects[] = new Project(
	"collabwareCLM",
	"Collabware - Content Lifecycle Management (CLM)",
	"<p>Collabware CLM is a DoD 5015.2 certified solution that integrates natively with SharePoint Server, providing automated classification, retention, and disposition of content with centrally configured rules enforced globally across SharePoint.</p>"
		. "<p>The solution includes an Aggregates system for case management, visual lifecycle workflows for complex content behaviors, and a global content query system for advanced metadata searches with grid view sorting and filtering. It features an automatically managed bulk disposition review system with pre-defined or dynamic reviewer rules.</p>"
		. "<p>CLM manages physical, email, and electronic records with integrated case management, workflows, and search capabilities to ensure regulatory and legal compliance. The solution uses a no-code drag-and-drop experience requiring no new infrastructure while remaining transparent to users.</p>",
	"Summer 2011 - Present",
	array("SharePoint Server", "SQL Server", "ASP.Net", "C#", "Dojo Toolkit", "JointJS+", "ASP.Net AJAX", "XSLT"),
	array(
		new ProjectImage("/img/gallery/clm/library.jpg", "/img/gallery/clm/library_tn.jpg", "CLM - Physical Records Library"),
		new ProjectImage("/img/gallery/clm/fileplan.jpg", "/img/gallery/clm/fileplan_tn.jpg", "CLM - Record Categories Management"),
		new ProjectImage("/img/gallery/clm/approvals.jpg", "/img/gallery/clm/approvals_tn.jpg", "CLM - Disposition Approval List"),
		new ProjectImage("/img/gallery/clm/i18n.jpg", "/img/gallery/clm/i18n_tn.jpg", "CLM - Multilingual Text Input"),
		new ProjectImage("/img/gallery/clm/details.jpg", "/img/gallery/clm/details_tn.jpg", "CLM - Lifecycle Details Dialog"),
		new ProjectImage("/img/gallery/clm/storyboard.jpg", "/img/gallery/clm/storyboard_tn.jpg", "CLM - Storyboarding"),
		new ProjectImage("/img/gallery/clm/sketch.jpg", "/img/gallery/clm/sketch_tn.jpg", "CLM - Sketches for Mobile UI"),
		new ProjectImage("/img/gallery/clm/userstory1.jpg", "/img/gallery/clm/userstory1_tn.jpg", "CLM - User Stories")
	),
	array (
		new ProjectVideo("vimeo", "64146993", 640, 480)
	),
	true
);

$projects[] = new Project(
	"vcInsite",
	"Vancity - Insite",
	"<p>Insite is the employee portal for Vancity, Canada's largest credit union. The portal is designed to engage employees, improve their business acumen and provide easy access to information on products and services to help them better serve members.</p>"
		. "<p>Content is aggregated and surfaced by topic, giving employees that have direct contact with members quick access to the information they need most frequently. This information is provided in the same friendly, accessible and conversational tone that staff use during their member interactions.</p>"
		. "<p>Insite was a finalist for the 2011 Microsoft Partner Network IMPACT Awards Portals and Collaboration category. Insite also received an honourable mention from the Intranet Innovation Awards for its Search Find-o-meter.</p>",
	"Fall 2010",
	array("SharePoint 2010", "ASP.Net", "C#", "jQuery", "XSLT"),
	array(
		new ProjectImage("/img/gallery/vcInsite/home.jpg", "/img/gallery/vcInsite/home_tn.jpg", "Insite - Home Page"),
		new ProjectImage("/img/gallery/vcInsite/rates.jpg", "/img/gallery/vcInsite/rates_tn.jpg", "Insite - Serving Members Mock-up"),
		//new ProjectImage("/img/gallery/vcInsite/interior.jpg", "/img/gallery/vcInsite/interior_tn.jpg", "Insite - Interior Page Mock-up"),
		new ProjectImage("/img/gallery/vcInsite/search.jpg", "/img/gallery/vcInsite/search_tn.jpg", "Insite - Search Results"),
		new ProjectImage("/img/gallery/vcInsite/mysite.jpg", "/img/gallery/vcInsite/mysite_tn.jpg", "Insite - Employee Profile")
	),
	array(),
	false
);

$projects[] = new Project(
	"servusCafe",
	"Servus Credit Union - <em>cafe</em>",
	"<p><em>cafe</em> is a crowdsourcing solution designed to empower employees to engage in open dialogue aimed at improving the organization and establishing a sense of community across Servus. Employees are given the opportunity to anonymously pose questions of interest and others can rate and respond to these questions.</p>"
		. "<p><em>cafe</em> also allows the executive team to respond to the top ideas and move appropriate items into a separate notes area. The executive leadership team can communicate on the status of each noted idea and employees can continue to comment on these items, fostering increased collaboration between the executive leadership team and the organization's employees.</p>"
		. "<p>Habanero Consulting Group was awarded Portals and Collaboration Solution of the Year at the 2010 Microsoft Partner Network IMPACT Awards for the work on <em>cafe</em>.</p>",
	"Spring 2010",
	array("SharePoint 2010", "ASP.Net", "C#", "jQuery", "XSLT"),
	array(
		new ProjectImage("/img/gallery/servusCafe/posts.jpg", "/img/gallery/servusCafe/posts_tn.jpg", "cafe - Posts Page Mock-up"),
		new ProjectImage("/img/gallery/servusCafe/create.jpg", "/img/gallery/servusCafe/create_tn.jpg", "cafe - New Post Dialog Mock-up")
	),
	array(),
	false
);

$projects[] = new Project(
	"devon",
	"Devon Energy - Strata",
	"<p>In the summer of 2009, Devon Energy updated their employee portal from flat HTML files and a collection of different web applications to a unified SharePoint 2007 platform."
		. " One of the project goals was for Habanero to ramp up Devon's internal development team on SharePoint development so that they would be able to further develop the portal on their own after the initial launch.</p>"
		. "<p>Over the course of six months the blended team worked across three different time zones. Habanero developers in Vancouver were paired with Devon developers, who were located in Oklahoma City, Houston and Calgary. I personally worked with two Devon developers and trained them on topics such as SharePoint development best practices, branding SharePoint, jQuery and advanced HTML/CSS techniques.</p>",
	"Summer/Fall 2009",
	array("SharePoint 2007", "ASP.Net", "C#", "jQuery", "XSLT"),
	array(
		new ProjectImage("/img/gallery/devon/home.jpg", "/img/gallery/devon/home_tn.jpg", "Strata - Home Page Mock-up"),
		new ProjectImage("/img/gallery/devon/tools.jpg", "/img/gallery/devon/tools_tn.jpg", "Strata - Tools and Reports Mock-up"),
		new ProjectImage("/img/gallery/devon/teamsite.jpg", "/img/gallery/devon/teamsite_tn.jpg", "Strata - Collaboration Team Site Mock-up"),
		new ProjectImage("/img/gallery/devon/profile.jpg", "/img/gallery/devon/profile_tn.jpg", "Strata - User Profile Mock-up")
	),
	array(),
	false
);

$projects[] = new Project(
	"spMisc",
	"Other SharePoint 2007 and 2010 Projects",
	"<p>These are screen shots and/or mock-ups for additional SharePoint 2007 and 2010 projects that I was involved with.</p>",
	"2006 - 2012",
	array("SharePoint 2010", "SharePoint 2007", "ASP.Net", "C#", "jQuery", "ASP.Net AJAX", "Telerik RadControls", "XSLT"),
	array(
		new ProjectImage("/img/gallery/spMisc/collabware.jpg", "/img/gallery/spMisc/collabware_tn.jpg", "Collabware - External Website - Summer 2010"),
		new ProjectImage("/img/gallery/spMisc/fortisbc.jpg", "/img/gallery/spMisc/fortisbc_tn.jpg", "FortisBC - External Website - Winter 2010"),
		new ProjectImage("/img/gallery/spMisc/bchydro.jpg", "/img/gallery/spMisc/bchydro_tn.jpg", "BC Hydro - Energy Managers Extranet - Winter 2009"),
		new ProjectImage("/img/gallery/spMisc/capp.jpg", "/img/gallery/spMisc/capp_tn.jpg", "Canadian Association of Petroleum Producers - External Website - Summer 2008"),
		new ProjectImage("/img/gallery/spMisc/calgary.jpg", "/img/gallery/spMisc/calgary_tn.jpg", "City of Calgary - Employee Portal - Spring 2008"),
		new ProjectImage("/img/gallery/spMisc/goldcorp.jpg", "/img/gallery/spMisc/goldcorp_tn.jpg", "GoldCorp - Company Intranet - Fall 2007"),
		new ProjectImage("/img/gallery/spMisc/pdnet.jpg", "/img/gallery/spMisc/pdnet_tn.jpg", "Certified General Accountants of Canada - PDNet - Fall 2007")
	),
	array(),
	true
);

$projects[] = new Project(
	"habExternal",
	"Habanero Consulting Group - External Website",
	"<p>The Habanero external website was a showcase for Habanero's experience and knowledge on SiteFinity customization.</p>"
		. "<p>An interesting user interface concept was the use of modals to spotlight and navigate related information based on author-defined scope without the user losing their original context.</p>",
	"Winter 2008",
	array("SiteFinity", "ASP.Net", "C#", "jQuery"),
	array(
		new ProjectImage("/img/gallery/habExternal/home.jpg", "/img/gallery/habExternal/home_tn.jpg", "HabaneroConsulting.com - Home Page"),
		new ProjectImage("/img/gallery/habExternal/projects.jpg", "/img/gallery/habExternal/projects_tn.jpg", "HabaneroConsulting.com - Projects Gallery"),
		new ProjectImage("/img/gallery/habExternal/project.jpg", "/img/gallery/habExternal/project_tn.jpg", "HabaneroConsulting.com - Project Modal"),
		new ProjectImage("/img/gallery/habExternal/profile.jpg", "/img/gallery/habExternal/profile_tn.jpg", "HabaneroConsulting.com - Employee Profile Modal")
	),
	array(),
	false
);

$projects[] = new Project(
	"cornerstone",
	"SE Cornerstone Public School Division - Financial Reporting System",
	"<p>Habanero developed a streamlined and easy-to-use financial reporting solution for the SE Cornerstone Public School District. A custom web interface with multi-step wizards replaced the complex Dynamics single page input forms for the most often used actions.</p>"
		. "<p>The solution was a finalist for the <a target=\"_blank\" href=\"https://mspartner.microsoft.com/en/ca/Pages/impact-award-finalists-2009.aspx\">2009 Microsoft Partner Network IMPACT Awards</a>' Finance (ERP) category.</p>",
	"Fall 2008",
	array("Dynamics ERP", "ASP.Net", "C#", "ASP.Net AJAX", "Telerik RadControls"),
	array(
		new ProjectImage("/img/gallery/cornerstone/home.jpg", "/img/gallery/cornerstone/home_tn.jpg", "Budget System - Home Page"),
		new ProjectImage("/img/gallery/cornerstone/step1.jpg", "/img/gallery/cornerstone/step1_tn.jpg", "Budget System - New Purchase Order, Step 1"),
		new ProjectImage("/img/gallery/cornerstone/step2.jpg", "/img/gallery/cornerstone/step2_tn.jpg", "Budget System - New Purchase Order, Step 2"),
		new ProjectImage("/img/gallery/cornerstone/deposit.jpg", "/img/gallery/cornerstone/deposit_tn.jpg", "Budget System - Deposit")
	),
	array(),
	false
);


$projects[] = new Project(
	"constosoriders",
	"Microsoft - Contoso Riders Quick App",
	"<p>Microsoft approached Habanero to create a membership application that provided a fresh user experience and demonstrated the use of Windows Live services for the development community as part of the <a target=\"_blank\" href=\"http://wlquickapps.codeplex.com/wikipage?title=Contoso%20Riders&referringTitle=Home&ProjectName=wlquickapps\">Windows Live Quick Applications</a> project on CodePlex.</p>"
		. "<p>The result was Contoso Riders, which leveraged the following Windows Live services:</p>"
		. "<div class=\"row\"><div class=\"six columns\"><ul class=\"disc\"><li>Windows Live ID Web Authentication</li><li>Windows Live Presence</li><li>Windows Live Messenger IM Control</li><li>Windows Live Spaces</li></ul></div><div class=\"six columns\"><ul class=\"disc\"><li>Silverlight Streaming</li><li>Bing Maps</li><li>Virtual Earth</li></ul></div></div>"
		. "<p>I was also asked to present Contoso Riders at Microsoft's EnergizeIT conference.</p>",
	"Spring 2008",
	array("Windows Live Services", "Silverlight", "Bing Maps", "ASP.Net", "C#", "ASP.Net AJAX"),
	array(
		new ProjectImage("/img/gallery/contosoriders/home.jpg", "/img/gallery/contosoriders/home_tn.jpg", "Contoso Riders - Home Page Mock-up"),
		new ProjectImage("/img/gallery/contosoriders/expo.jpg", "/img/gallery/contosoriders/expo_tn.jpg", "Contoso Riders - Events Page Mock-up"),
		new ProjectImage("/img/gallery/contosoriders/energizeit.jpg", "/img/gallery/contosoriders/energizeit_tn.jpg", "Contoso Riders - Speaking at EnergizeIT")
	),
	array(),
	false
);

$projects[] = new Project(
	"bpDashboard",
	"Boston Pizza - Franchisee Dashboard",
	"<p>The Franchisee Dashboard was an interactive display situated in the lobby of Boston Pizza's Richmond headquarters."
		. " Visitors could interact with the display and could view information for any of the Boston Pizza or Boston's Gourmet Pizza locations throughout North America.</p>"
		. "<p>The Dashboard is an example a projected that was not targeted at desktop browsers and used 10 foot and game user interface design principles. The original Franchisee Dashboard was controlled using a Nintendo Wii-mote, with subsequent versions using a gyroscopic mouse. Eventually a browser-based port was also developed that was accessible through Boston Pizza's intranet.</p>",
	"Winter 2006",
	array("Adobe Flex", "ActionScript 3.0", "Nintendo Wii-mote", "10 Foot UI Design"),
	array(
		new ProjectImage("/img/gallery/bpDashboard/home.jpg", "/img/gallery/bpDashboard/home_tn.jpg", "Franchisee Dashboard - Home Screen"),
		new ProjectImage("/img/gallery/bpDashboard/map.jpg", "/img/gallery/bpDashboard/map_tn.jpg", "Franchisee Dashboard - Map View"),
		new ProjectImage("/img/gallery/bpDashboard/list.jpg", "/img/gallery/bpDashboard/list_tn.jpg", "Franchisee Dashboard - List View"),
		new ProjectImage("/img/gallery/bpDashboard/store.jpg", "/img/gallery/bpDashboard/store_tn.jpg", "Franchisee Dashboard - Store Information")
	),
	array(),
	false
);

$projects[] = new Project(
	"holidayPuppet",
	"Grey Holiday Puppet",
	"<p>The Grey Holiday Puppet was a holiday greeting to Grey clients and friends. What began as a last minute project with extremely limited resources, time and budget turned into a viral hit which was featured on del.icio.us and MetaFilter and garnering visitors from as far off as France, Sweden and Russia."
		. "<p>The Holiday Puppet won numerous creative and design accolades including the 2005 Lotus Award for Best Self Promotion.</p>"
		. "<p class=\"needs-flash\">You can <a target=\"_blank\" href=\"http://holidaypuppet.singchan.com\" title=\"View the Grey Holiday Puppet site.\">view the project here</a>. Just a note, the link to the PDF is broken, but you can <a target=\"_blank\" href=\"http://holidaypuppet.singchan.com/greyholidaypuppet.pdf\">download the puppet here</a>. Enjoy!</p>",
	"Winter 2005",
	array("Adobe Flash", "ActionScript 2.0"),
	array(
		new ProjectImage("/img/gallery/holidaypuppet/hockey.jpg", "/img/gallery/holidaypuppet/hockey_tn.jpg", "Grey Holiday Puppet - Keep the Biscuits Out!"),
		new ProjectImage("/img/gallery/holidaypuppet/graduate.jpg", "/img/gallery/holidaypuppet/graduate_tn.jpg", "Grey Holiday Puppet - Hello, Mrs. Robinson."),
		new ProjectImage("/img/gallery/holidaypuppet/fingers.jpg", "/img/gallery/holidaypuppet/fingers_tn.jpg", "Grey Holiday Puppet - Fat Fingers"),
		new ProjectImage("/img/gallery/holidaypuppet/puppet.jpg", "/img/gallery/holidaypuppet/puppet_tn.jpg", "Grey Holiday Puppet - The Nutcracker Cut-out")
	),
	array(),
	false
);

$projects[] = new Project(
	"quadrant",
	"Quadrant Homes - External Website",
	"<p>Quadrant Homes, the largest home builder in Washington state, had a simple assignment: make QuadrantHomes.com the best homebuilder web site in the United States. The redesign included interactive Flash-based tools allowing new prospects and purchasers to plan their new home.</p>"
		. "<p>The site has been met with praise from Quadrant employees, customers and realtor partners alike, resulting in increased interest list sign-ups, intent to purchase and sales numbers.</p>",
	"Fall 2005",
	array("PHP", "PostgreSQL", "Adobe Flash", "ActionScript 2.0"),
	array(
		new ProjectImage("/img/gallery/quadrant/home.jpg", "/img/gallery/quadrant/home_tn.jpg", "Quadrant Homes - Home Page Mock-up"),
		new ProjectImage("/img/gallery/quadrant/build1.jpg", "/img/gallery/quadrant/build1_tn.jpg", "Quadrant Homes - Build Your Home App"),
		new ProjectImage("/img/gallery/quadrant/build2.jpg", "/img/gallery/quadrant/build1_tn.jpg", "Quadrant Homes - Build Your Home App"),
		new ProjectImage("/img/gallery/quadrant/community.jpg", "/img/gallery/quadrant/community_tn.jpg", "Quadrant Homes - Community Page")
	),
	array (
		new ProjectVideo("vimeo", "64123615", 640, 360)
	),
	true
);

$projects[] = new Project(
	"thatchcay",
	"Thatch Cay",
	"<p>Only half a mile off the northeastern coastline of St. Thomas, Thatch Cay is one of the last undeveloped, privately-held U.S. Virgin Islands.</p>"
		. "<p>I was originally contracted by <em>dsire</em> and Loca Lola Design Team to consult and assist in the development of this Flash-based website. When the original Flash developer left the project on short notice, I was able to take over development and successfully complete the site on schedule and meet all of the project goals.</p>"
		. "<p class=\"needs-flash\">You can <a target=\"_blank\" href=\"http://thatchcay.singchan.com\" title=\"View the Thatch Cay flash site.\">view the project here.</a></p>",
	"Spring 2004",
	array("Adobe Flash", "ActionScript 2.0"),
	array(
		new ProjectImage("/img/gallery/thatchcay/history.jpg", "/img/gallery/thatchcay/history_tn.jpg", "Thatch Cay - History"),
		new ProjectImage("/img/gallery/thatchcay/vision.jpg", "/img/gallery/thatchcay/vision_tn.jpg", "Thatch Cay - Vision"),
		new ProjectImage("/img/gallery/thatchcay/possibilities.jpg", "/img/gallery/thatchcay/possibilities_tn.jpg", "Thatch Cay - Possibilities"),
		new ProjectImage("/img/gallery/thatchcay/location.jpg", "/img/gallery/thatchcay/location_tn.jpg", "Thatch Cay - Location")
	),
	array(),
	false
);

$projects[] = new Project(
	"gi",
	"Granvile Island - External Website",
	"<p>Granville Island is one of Vancouver's world renowned destination experiences.</p>"
		. "<p>GranvilleIsland.com was developed on top of Grey Vancouver's grASP CMS and included both HTML and, for-the-time, high-bandwidth Flash interfaces. The Flash web site included many discoverable interactive elements, videos and 360&#176; panoramas.</p>"
		. "<p class=\"needs-flash\">You can <a target=\"_blank\" href=\"http://gi.singchan.com\" title=\"View the Granville Island Flash asssets.\">view some of the Flash elements here</a>. Please note the CMS is not implemented in this environment and the navigation and descriptive content will not be populated.</p>",
	"Summer 2002",
	array("grASP CMS", "ASP Classic", "SQL Server", "XSLT", "Adobe Flash", "ActionScript 2.0"),
	array(
		new ProjectImage("/img/gallery/gi/home.jpg", "/img/gallery/gi/home_tn.jpg", "Granville Island - HTML Home Page"),
		new ProjectImage("/img/gallery/gi/flash.jpg", "/img/gallery/gi/flash_tn.jpg", "Granville Island - Flash Home Page"),
		new ProjectImage("/img/gallery/gi/dining.jpg", "/img/gallery/gi/dining_tn.jpg", "Granville Island - Eat and Drink"),
		new ProjectImage("/img/gallery/gi/kids.jpg", "/img/gallery/gi/kids_tn.jpg", "Granville Island - A Place for Kids")
	),
	array(),
	false
);

$projects[] = new Project(
	"ricksmith",
	"Rick Smith - Portfolio Site",
	"<p>Rick Smith's portfolio site is an example of a website for artists and photographers using a lightweight CMS which I developed. At the time, there were no inexpensive ASP and ASP.Net hosting solutions, so I developed the solution with PHP.</p>"
		. "<p>Due to the smaller-scale of these portfolio sites, I was able to experiment with effects and transitions using HTML and JavaScript instead of Flash.</p>"
		. "<p>Surpised that the DOM effects still work over a decade later, I've decided to put it back up <a target=\"_blank\" href=\"http://ricksmith.singchan.com\" title=\"View Rick Smith's portfolio site.\">for your viewing pleasure here</a>.</p>",
	"Spring 2002",
	array("PHP", "DynObjects"),
	array(
		new ProjectImage("/img/gallery/ricksmith/home.jpg", "/img/gallery/ricksmith/home_tn.jpg", "Rick Smith - Home Page"),
		new ProjectImage("/img/gallery/ricksmith/about.jpg", "/img/gallery/ricksmith/about_tn.jpg", "Rick Smith - About"),
		new ProjectImage("/img/gallery/ricksmith/work.jpg", "/img/gallery/ricksmith/work_tn.jpg", "Rick Smith - Working My Way Back"),
		new ProjectImage("/img/gallery/ricksmith/shaftebury.jpg", "/img/gallery/ricksmith/shaftebury_tn.jpg", "Rick Smith - Shaftebury Beer Web Site")
	),
	array(),
	false
);

$projects[] = new Project(
	"grasp",
	"Grey Advertising - grASP Content Management System",
	"<p>I co-developed grASP, a modular and extensible content management system allowing Grey Advertising Vancouver to quickly produce and deploy engaging and dynamic web solutions.</p>",
	"2001 - 2006",
	array("ASP Classic", "SQL Server", "Server JScript", "XSLT", "Adobe Flash", "ActionScript 2.0"),
	array(
		new ProjectImage("/img/gallery/grASP/ldb.jpg", "/img/gallery/grASP/ldb_tn.jpg", "BC Liquor Distribution Branch - 2000 to 2006"),
		new ProjectImage("/img/gallery/grASP/sisu.jpg", "/img/gallery/grASP/sisu_tn.jpg", "SISU Vitamins and Supplements - Spring 2004"),
		new ProjectImage("/img/gallery/grASP/inhaus.jpg", "/img/gallery/grASP/inhaus_tn.jpg", "Inhaus Flooring - Summer 2003"),
		new ProjectImage("/img/gallery/grASP/ledcor.jpg", "/img/gallery/grASP/ledcor_tn.jpg", "Ledcor Group of Companies - Spring 2003"),
		new ProjectImage("/img/gallery/grASP/adt.jpg", "/img/gallery/grASP/adt_tn.jpg", "ADT Security Canada - Winter 2002"),
		new ProjectImage("/img/gallery/gi/dining.jpg", "/img/gallery/gi/dining_tn.jpg", "Granville Island - Summer 2002"),
	),
	array(),
	true
);



$total = count($projects);
$page = $_GET["page"];
$size = $_GET["size"];
$startIdx = $page * $size;
$endIdx = $startIdx + $size - 1;
if ($endIdx > ($total - 1)) {
	$endIdx = ($total - 1);
}

$responseItems = array();

for ($i = $startIdx; $i <= $endIdx; $i++) {
    $responseItems[] = $projects[$i];
}

$response = new Response($total, $startIdx, $endIdx, $responseItems);
print json_encode($response);
?>