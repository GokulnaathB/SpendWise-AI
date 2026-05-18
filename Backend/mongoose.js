const User = require("./models/user");
const Expense = require("./models/expense");
const Budget = require("./models/budget");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");

const createUser = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Signing up failed, please try again later.",
      error: err,
    });
  }
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User with this email already exists",
    });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Signing up failed, please try again later.",
      error: err,
    });
  }
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });
  let result;
  try {
    result = await newUser.save();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Signing up failed, please try again later.",
      error: err,
    });
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2h",
      },
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Signing up failed, please try again later.",
      error: err,
    });
  }

  res.status(201).json({
    success: true,
    message: "User created successfully.",
    user: {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      token,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Logging in failed, please try again later.",
      error: err,
    });
  }
  if (!existingUser) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials.",
    });
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Logging in failed, please try again later.",
      error: err,
    });
  }
  if (!isValidPassword) {
    return res.status(403).json({
      success: false,
      message: "Incorrect password.",
    });
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2h",
      },
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Logging in failed, please try again later.",
      error: err,
    });
  }

  res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    user: {
      id: existingUser._id,
      email: existingUser.email,
      token,
    },
  });
};

const addExpense = async (req, res, next) => {
  const { nameOfTheExpense, category, cost, date } = req.body;
  const userId = req.user.userId;
  const expense = new Expense({
    userId,
    nameOfTheExpense,
    category,
    cost,
    date,
  });
  try {
    await expense.save();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldn't add expense.",
      error: err,
    });
  }
  res.status(201).json({
    success: true,
    message: "Added expense successfully.",
    expense,
  });
};

const fetchExpenses = async (req, res, next) => {
  const { date, search = "", page = 1, limit = 3 } = req.query;
  const query = { userId: req.user.userId, date };
  if (search) {
    query.$or = [
      {
        nameOfTheExpense: { $regex: search, $options: "i" },
      },
      {
        category: { $regex: search, $options: "i" },
      },
    ];
  }
  let expenses;
  let count;
  try {
    expenses = await Expense.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    total = await Expense.countDocuments(query);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Fetching expenses failed.",
      error: err,
    });
  }

  res.status(200).json({
    success: true,
    message: "Expenses fetched successfully.",
    expenses,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

const fetchExpense = async (req, res, next) => {
  const { expenseId } = req.body;
  let expense;
  try {
    expense = await Expense.findOne({ _id: expenseId });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Couldn't load the expense, please try again.",
      error: err,
    });
  }

  res.status(200).json({
    success: true,
    message: "Fetched expense successfully.",
    expense,
  });
};

const editExpense = async (req, res, next) => {
  const { expenseID, nameOfTheExpense, category, cost, date } = req.body;
  let expense;
  try {
    expense = await Expense.findOneAndUpdate(
      { _id: expenseID, userId: req.user.userId },
      { nameOfTheExpense, category, cost, date },
    );
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Couldn't update the expense. Please try again.",
      error: err,
    });
  }

  res.status(200).json({
    success: true,
    message: "Expense updated successfully.",
    expense,
  });
};

const deleteExpense = async (req, res, next) => {
  const { expID } = req.body;
  let expense;
  try {
    expense = await Expense.findOneAndDelete({
      _id: expID,
      userId: req.user.userId,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Couldn't delete the expense.",
      error: err,
    });
  }

  res.status(200).json({
    success: true,
    message: "Deleted expense successfully.",
    expense,
  });
};

const numToMonth = new Map();
numToMonth.set("01", "Jan");
numToMonth.set("02", "Feb");
numToMonth.set("03", "Mar");
numToMonth.set("04", "Apr");
numToMonth.set("05", "May");
numToMonth.set("06", "Jun");
numToMonth.set("07", "Jul");
numToMonth.set("08", "Aug");
numToMonth.set("09", "Sep");
numToMonth.set("10", "Oct");
numToMonth.set("11", "Nov");
numToMonth.set("12", "Dec");

const addBudget = async (req, res, next) => {
  const { year, month, budget } = req.body;
  const { userId } = req.user;
  let _budget;
  try {
    _budget = await Budget.findOne({ userId, year, month });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again.",
      error: err,
    });
  }
  if (_budget) {
    return res.status(400).json({
      success: false,
      message: `You've already set a budget for ${numToMonth.get(month)} ${year} in the past. You can only update it, if you want to.`,
    });
  }
  _budget = new Budget({
    userId,
    year,
    month,
    budget,
  });
  try {
    await _budget.save();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldn't set budget, please try again.",
      error: err,
    });
  }
  res.status(200).json({
    success: true,
    message: "Budget set successfully.",
  });
};

const updateBudget = async (req, res, next) => {
  const { month, year, budget } = req.body;
  const { userId } = req.user;
  let _budget;
  try {
    _budget = await Budget.findOne({ month, year, userId });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again.",
      error: err,
    });
  }
  if (!_budget) {
    return res.status(400).json({
      success: false,
      message: `You've never set a buget for ${numToMonth.get(month)} ${year} in the past. You can update a budget only if you've set it in the past. Hope that makes sense.`,
    });
  }
  try {
    await Budget.findOneAndUpdate({ userId, month, year }, { budget });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again.",
      error: err,
    });
  }
  res.status(200).json({
    success: true,
    message: `${numToMonth.get(month)} ${year} budget updated to ${budget} successfully.`,
  });
};

const getBudget = async (req, res, next) => {
  const { month, year } = req.body;
  const { userId } = req.user;
  let budget;
  try {
    budget = await Budget.findOne({ userId, month, year });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try logging out and logging in.",
      error: err,
    });
  }
  if (!budget) {
    return res.status(200).json({
      success: false,
      message: `You haven't yet set the budget for ${numToMonth.get(month)} ${year}.`,
      budget,
    });
  }
  res.status(200).json({
    success: true,
    message: "Budget fetched successfully.",
    budget,
  });
};

const getTotal = async (req, res, next) => {
  const { month, year } = req.body;
  const { userId } = req.user;
  let expenses;
  try {
    expenses = await Expense.find({
      userId,
      date: { $regex: `^${year}-${month}-` },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while fetching expenses to calculate the monthly total of ${numToMonth.get(month)} ${year}. Please try logging out and logging in.`,
      error: err,
    });
  }
  let total = 0;
  for (let i = 0; i < expenses.length; i += 1) total += expenses[i].cost;
  res.status(200).json({
    success: true,
    message: "Calculated monthly total successfully.",
    total: total,
  });
};

const visualize = async (req, res, next) => {
  const { year } = req.body;
  const { userId } = req.user;
  let expenses;
  try {
    expenses = await Expense.find({ userId, date: { $regex: `^${year}-` } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while fetching ${year} expenses to create the monthly expenditure graph. Please try logging out and logging in.`,
      error: err,
    });
  }
  if (!expenses) {
    return res.status(200).json({
      success: true,
      message: `You have no expenses in the year ${year}.`,
    });
  }
  const monthToTotal = new Map();
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  for (let i = 0; i < months.length; i += 1) monthToTotal.set(months[i], 0);
  let monthWiseTotal = [];
  for (let i = 0; i < expenses.length; i += 1) {
    const month = expenses[i].date.split("-")[1];
    const prevTotal = monthToTotal.get(month);
    monthToTotal.set(month, prevTotal + expenses[i].cost);
  }
  for (const key of monthToTotal.keys())
    monthWiseTotal.push({
      month: numToMonth.get(key),
      total: monthToTotal.get(key),
    });
  res.status(200).json({
    success: true,
    message: `Computed month wise total of ${year} successfully.`,
    monthWiseTotal,
  });
};

const monthToNumMap = new Map();
monthToNumMap.set("Jan", "01");
monthToNumMap.set("Feb", "02");
monthToNumMap.set("Mar", "03");
monthToNumMap.set("Apr", "04");
monthToNumMap.set("May", "05");
monthToNumMap.set("Jun", "06");
monthToNumMap.set("Jul", "07");
monthToNumMap.set("Aug", "08");
monthToNumMap.set("Sep", "09");
monthToNumMap.set("Oct", "10");
monthToNumMap.set("Nov", "11");
monthToNumMap.set("Dec", "12");
const analyzeMonthly = async (req, res, next) => {
  let { year, month } = req.body;
  const { userId } = req.user;
  month = monthToNumMap.get(month);
  let expenses;
  try {
    expenses = await Expense.find({
      userId,
      date: { $regex: `^${year}-${month}` },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      messsage: `Some error occoured while fetching ${numToMonth.get(month)} ${year} expenses to analyze. Please try logging out and logging in.`,
      error: err,
    });
  }
  if (!expenses) {
    return res.status(200).json({
      success: true,
      messsage: `${numToMonth.get(month)} ${year} has got no expenses.`,
    });
  }
  let total = 0;
  for (let i = 0; i < expenses.length; i += 1) total += expenses[i].cost;
  const simplified = expenses.map((e) => ({
    nameOfTheExpense: e.nameOfTheExpense,
    category: e.category,
    cost: e.cost,
  }));
  let budget;
  try {
    budget = await Budget.findOne({ userId, month, year });
  } catch (err) {
    return res.status(500).json({
      success: false,
      messsage: `Some error occoured while fetching budget of ${numToMonth.get(month)} ${year} to analyze ${numToMonth.get(month)} expenses. Please try logging out and logging in.`,
      error: err,
    });
  }
  if (budget) {
    budget = budget.budget;
  } else {
    budget = "Budget not set.";
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Analyze this user's expenses against total and budget and give 3 short insights along with a few tips for saving money. Remember: Currency is not dollars, it is Indian Rupees.

Expenses:
${JSON.stringify(simplified)}
Total expenses this month: ${JSON.stringify(total)}
Budget of this month: ${JSON.stringify(budget)}

Keep it simple and helpful.
          `,
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Here's your AI analysis.",
      insights: response.choices[0].message.content,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        "Couldn't AI-Analyze your expenses. Could be that you've ran out of OpenAI credits. If that's not the case, try logging out and logging in.",
      error: err,
    });
  }
};

const analyzeYearly = async (req, res, next) => {
  const year = req.body.yearForYearly;
  const { userId } = req.user;
  let expenses;
  try {
    expenses = await Expense.find({ userId, date: { $regex: `^${year}-` } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while fetching ${year} expenses to AI-Analyze. Could be that you've ran out of OpenAI credits. If that's not the case, try logging out and logging in.`,
      error: err,
    });
  }
  if (!expenses) {
    return res.status(200).json({
      success: true,
      message: `You've got no expenses in the year ${year}.`,
    });
  }
  // pass to AI
  const simplified = expenses.map((e) => ({
    nameOfTheExpense: e.nameOfTheExpense,
    category: e.category,
    cost: e.cost,
    date: e.date,
  }));

  const monthToTotal = new Map();
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  for (let i = 0; i < months.length; i += 1) monthToTotal.set(months[i], 0);

  // pass to AI
  let monthWiseTotal = [];
  for (let i = 0; i < expenses.length; i += 1) {
    const month = expenses[i].date.split("-")[1];
    const prevTotal = monthToTotal.get(month);
    monthToTotal.set(month, prevTotal + expenses[i].cost);
  }
  for (const key of monthToTotal.keys())
    monthWiseTotal.push({
      month: numToMonth.get(key),
      total: monthToTotal.get(key),
    });

  let budgets;
  try {
    budgets = await Budget.find({ userId, year });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Couldn't fetch the monthly budgets of year ${year} for AI-Analysis. Please try logging out and logging in.`,
      error: err,
    });
  }

  // pass to AI
  let _budgets = [];
  const monthToBudget = new Map();
  for (let i = 0; i < months.length; i += 1)
    monthToBudget.set(numToMonth.get(months[i]), "Budget not set");
  for (let i = 0; i < budgets.length; i += 1)
    monthToBudget.set(numToMonth.get(budgets[i].month), budgets[i].budget);
  for (const key of monthToBudget.keys())
    _budgets.push({ month: key, budget: monthToBudget.get(key) });

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Analyze this user's expenses in the year ${year} against their month wise total expenses and month wise budget (both of which I'm providing you) and give 3 short insights along with a few tips for saving money. Remember: Currency is not dollars, it is Indian Rupees.

Expenses:
${JSON.stringify(simplified)}
Month wise expense total: ${JSON.stringify(monthWiseTotal)}
Month wise budget set by the person: ${JSON.stringify(_budgets)}

Keep it simple and helpful.
          `,
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Here's your AI analysis.",
      insights: response.choices[0].message.content,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        "Couldn't AI-Analyze your expenses. Could be that you've ran out of OpenAI credits. If that's not the case, try logging out and logging in.",
      error: err,
    });
  }
};

const getYearly = async (req, res, next) => {
  const year = req.body.yearForYearly;
  const { userId } = req.user;
  let expenses;
  try {
    expenses = await Expense.find({ userId, date: { $regex: `^${year}-` } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while fetching ${year} expenses. Try logging out and logging in.`,
      error: err,
    });
  }
  if (!expenses) {
    return res.status(200).json({
      success: true,
      message: `You've got no expenses in the year ${year}.`,
    });
  }
  res.status(200).json({
    success: true,
    message: "Here's your yearly expenses.",
    expenses,
  });
};

const getMonthly = async (req, res, next) => {
  let { yearForMonthly, monthForMonthly } = req.body;
  const { userId } = req.user;
  year = yearForMonthly;
  month = monthToNumMap.get(monthForMonthly);
  let expenses;
  try {
    expenses = await Expense.find({
      userId,
      date: { $regex: `^${year}-${month}` },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      messsage: `Some error occoured while fetching ${numToMonth.get(month)} ${year} expenses. Please try logging out and logging in.`,
      error: err,
    });
  }
  if (!expenses) {
    return res.status(200).json({
      success: true,
      messsage: `${numToMonth.get(month)} ${year} has got no expenses.`,
    });
  }
  res.status(200).json({
    success: true,
    message: "Here's your monthly expenses.",
    expenses,
  });
};

exports.createUser = createUser;
exports.login = login;
exports.addExpense = addExpense;
exports.fetchExpenses = fetchExpenses;
exports.fetchExpense = fetchExpense;
exports.editExpense = editExpense;
exports.deleteExpense = deleteExpense;
exports.addBudget = addBudget;
exports.updateBudget = updateBudget;
exports.getBudget = getBudget;
exports.getTotal = getTotal;
exports.visualize = visualize;
exports.analyzeMonthly = analyzeMonthly;
exports.analyzeYearly = analyzeYearly;
exports.getYearly = getYearly;
exports.getMonthly = getMonthly;
