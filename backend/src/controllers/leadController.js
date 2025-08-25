const Lead = require("../models/Lead");
const { Op } = require("sequelize");

/**
 * @description Create a new lead for the authenticated user.
 * @route POST /leads
 * @access Private
 *
 * @param {Object} req.body
 * @param {string} req.body.first_name - First name of the lead
 * @param {string} req.body.last_name - Last name of the lead
 * @param {string} req.body.email - Email of the lead
 * @param {string} req.body.phone - Phone number of the lead
 * @param {string} req.body.company - Company name of the lead
 * @param {string} req.body.city - City of the lead
 * @param {string} req.body.state - State of the lead
 * @param {string} req.body.source - Source of the lead (e.g., website, referral)
 * @param {string} req.body.status - Status of the lead (e.g., new, contacted)
 * @param {number} req.body.score - Lead score
 * @param {number} req.body.lead_value - Potential deal value
 * @param {Date} req.body.last_activity_at - Timestamp of last activity
 * @param {boolean} req.body.is_qualified - Whether the lead is qualified
 *
 * @returns {201} - Returns the created lead object in JSON format
 * @returns {400} - If validation fails or creation error occurs
 */

exports.createLead = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      company,
      city,
      state,
      source,
      status,
      score,
      lead_value,
      last_activity_at,
      is_qualified,
    } = req.body;
    const lead = await Lead.create({
      userId: req.user.id,
      first_name,
      last_name,
      email,
      phone,
      company,
      city,
      state,
      source,
      status,
      score,
      lead_value,
      last_activity_at,
      is_qualified,
    });
    res.status(201).json(lead);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating lead", error: err.message });
  }
};

/**
 * @description Bulk create multiple leads for the authenticated user.
 * @route POST /leads/bulk
 * @access Private
 *
 * @param {Object} req.body
 * @param {Array<Object>} req.body.leads - Array of lead objects to create
 *
 * @returns {201} - Returns a success message and the created leads
 * @returns {400} - If validation fails or creation error occurs
 */
exports.bulkCreateLeads = async (req, res) => {
  try {
    const { leads } = req.body;
    const userId = req.user.id;

    const sanitizedLeads = leads.map((lead) => {
      const { id, userId: inputUserId, ...rest } = lead;
      return { ...rest, userId };
    });

    const createdLeads = await Lead.bulkCreate(sanitizedLeads, {
      returning: true,
    });

    res.status(201).json({
      message: `${createdLeads.length} leads created successfully`,
      data: createdLeads,
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({
      message: "Failed to create leads",
      error: err.message,
    });
  }
};

/**
 * @description Get paginated, filtered, and sorted list of leads for the authenticated user.
 * @route GET /leads
 * @access Private
 *
 * @param {Object} req.query
 * @param {number} [req.query.page=1] - Page number
 * @param {number} [req.query.limit=20] - Number of items per page
 * @param {string} [req.query.email] - Exact email filter
 * @param {string} [req.query.company] - Exact company filter
 * @param {string} [req.query.city] - Exact city filter
 * @param {string[]} [req.query.status] - Filter by status
 * @param {string[]} [req.query.source] - Filter by source
 * @param {number} [req.query.score_gt] - Score greater than
 * @param {number} [req.query.score_lt] - Score less than
 * @param {number[]} [req.query.score_between] - Score between [min,max]
 * @param {number} [req.query.lead_value_gt] - Lead value greater than
 * @param {number} [req.query.lead_value_lt] - Lead value less than
 * @param {number[]} [req.query.lead_value_between] - Lead value between [min,max]
 * @param {Date} [req.query.created_at_after] - Created after date
 * @param {Date} [req.query.created_at_before] - Created before date
 * @param {Date[]} [req.query.created_at_between] - Created between [start,end]
 * @param {boolean} [req.query.is_qualified] - Filter by qualification
 * @param {string} [req.query.q] - Search term for name, email, company
 *
 * @returns {200} - Paginated leads with metadata (total, page, totalPages)
 * @returns {500} - If a server error occurs while fetching
 */
exports.getLeads = async (req, res) => {
  try {
    const userId = req.user.id;
    let { page = 1, limit = 20, ...filters } = req.query;
    page = parseInt(page) < 1 ? 1 : parseInt(page);
    limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const where = {};

    ["email", "company", "city"].forEach((field) => {
      if (filters[field]) {
        if (
          typeof filters[field] === "string" &&
          filters[field].startsWith("%") &&
          filters[field].endsWith("%")
        ) {
          where[field] = { [Op.iLike]: filters[field] };
        } else if (filters[field + "_contains"]) {
          where[field] = { [Op.iLike]: `%${filters[field + "_contains"]}%` };
        } else {
          where[field] = filters[field];
        }
      }
    });

    ["status", "source"].forEach((field) => {
      if (filters[field]) {
        if (Array.isArray(filters[field])) {
          where[field] = { [Op.in]: filters[field] };
        } else if (filters[field + "_in"]) {
          where[field] = {
            [Op.in]: Array.isArray(filters[field + "_in"])
              ? filters[field + "_in"]
              : String(filters[field + "_in"]).split(","),
          };
        } else {
          where[field] = filters[field];
        }
      }
    });

    [
      ["score", "score"],
      ["lead_value", "lead_value"],
    ].forEach(([field, param]) => {
      if (filters[param]) where[field] = filters[param];
      if (filters[param + "_gt"])
        where[field] = {
          ...(where[field] || {}),
          [Op.gt]: filters[param + "_gt"],
        };
      if (filters[param + "_lt"])
        where[field] = {
          ...(where[field] || {}),
          [Op.lt]: filters[param + "_lt"],
        };
      if (filters[param + "_between"]) {
        let vals = Array.isArray(filters[param + "_between"])
          ? filters[param + "_between"]
          : String(filters[param + "_between"]).split(",");
        if (vals.length === 2) where[field] = { [Op.between]: vals };
      }
    });

    [
      ["created_at", "created_at"],
      ["last_activity_at", "last_activity_at"],
    ].forEach(([field, param]) => {
      if (filters[param + "_on"])
        where[field] = { [Op.eq]: filters[param + "_on"] };
      if (filters[param + "_before"])
        where[field] = {
          ...(where[field] || {}),
          [Op.lt]: filters[param + "_before"],
        };
      if (filters[param + "_after"])
        where[field] = {
          ...(where[field] || {}),
          [Op.gt]: filters[param + "_after"],
        };
      if (filters[param + "_between"]) {
        let vals = Array.isArray(filters[param + "_between"])
          ? filters[param + "_between"]
          : String(filters[param + "_between"]).split(",");
        if (vals.length === 2) where[field] = { [Op.between]: vals };
      }
    });

    if (filters.is_qualified !== undefined) {
      if (filters.is_qualified === "true" || filters.is_qualified === true)
        where.is_qualified = true;
      else if (
        filters.is_qualified === "false" ||
        filters.is_qualified === false
      )
        where.is_qualified = false;
    }

    if (filters.q) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${filters.q}%` } },
        { last_name: { [Op.iLike]: `%${filters.q}%` } },
        { email: { [Op.iLike]: `%${filters.q}%` } },
        { company: { [Op.iLike]: `%${filters.q}%` } },
      ];
    }

    const leads = await Lead.findAndCountAll({
      where: { ...where, userId },
      offset: (page - 1) * limit,
      limit,
      order: [["created_at", "DESC"]],
    });
    res.json({
      data: leads.rows,
      page,
      limit,
      total: leads.count,
      totalPages: Math.ceil(leads.count / limit),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching leads", error: err.message });
  }
};

/**
 * @description Get a single lead by ID for the authenticated user.
 * @route GET /leads/:id
 * @access Private
 *
 * @param {Object} req.params
 * @param {string} req.params.id - Lead ID
 *
 * @returns {200} - Returns the lead object
 * @returns {404} - If the lead is not found
 * @returns {500} - If a server error occurs
 */

exports.getLeadById = async (req, res) => {
  try {
    const userId = req.user.id;
    const lead = await Lead.findOne({ where: { id: req.params.id, userId } });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching lead", error: err.message });
  }
};

/**
 * @description Update a lead by ID for the authenticated user.
 * @route PUT /leads/:id
 * @access Private
 *
 * @param {Object} req.params
 * @param {string} req.params.id - Lead ID
 *
 * @param {Object} req.body - Fields to update (any lead field)
 *
 * @returns {200} - Returns the updated lead object
 * @returns {404} - If the lead is not found
 * @returns {400} - If validation fails or update error occurs
 */
exports.updateLead = async (req, res) => {
  try {
    const userId = req.user.id;
    const lead = await Lead.findOne({ where: { id: req.params.id, userId } });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    await lead.update(req.body);
    res.json(lead);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating lead", error: err.message });
  }
};

/**
 * @description Delete a lead by ID for the authenticated user.
 * @route DELETE /leads/:id
 * @access Private
 *
 * @param {Object} req.params
 * @param {string} req.params.id - Lead ID
 *
 * @returns {200} - Returns a success message on deletion
 * @returns {404} - If the lead is not found
 * @returns {500} - If a server error occurs during deletion
 */
exports.deleteLead = async (req, res) => {
  try {
    const userId = req.user.id;
    const lead = await Lead.findOne({ where: { id: req.params.id, userId } });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    await lead.destroy();
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting lead", error: err.message });
  }
};
/**
 * @description Bulk delete leads by IDs for the authenticated user.
 * @route DELETE /leads/bulk
 * @access Private
 *
 * @param {Object} req.body
 * @param {Array<string>} req.body.ids - Array of lead IDs to delete
 *
 * @returns {200} - Returns a success message on deletion
 * @returns {400} - If request body is invalid or no IDs provided
 * @returns {500} - If a server error occurs during deletion
 */
exports.bulkDelete = async (req, res) => {
  try {
    const userId = req.user.id;
    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }
    await Lead.destroy({ where: { id: ids, userId } });
    res.json({ message: "Leads deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting leads", error: err.message });
  }
};
