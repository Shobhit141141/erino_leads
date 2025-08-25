const Lead = require("../models/Lead");
const { Op } = require("sequelize");

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

exports.bulkCreateLeads = async (req, res) => {
  try {
    const { leads } = req.body;
    const userId = req.user.id;
    
   
    const sanitizedLeads = leads.map(lead => {
      const { id, userId: inputUserId, ...rest } = lead;
      return { ...rest, userId }; 
    });
        
    const createdLeads = await Lead.bulkCreate(sanitizedLeads, {
      returning: true 
    });
        
    res.status(201).json({
      message: `${createdLeads.length} leads created successfully`,
      data: createdLeads
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ 
      message: "Failed to create leads", 
      error: err.message 
    });
  }
};

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
