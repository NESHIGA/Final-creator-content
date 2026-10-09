function health(req, res) {
  res.status(200).json({
    success: true,
    message: 'CreatorOS AI API is running',
  });
}

module.exports = { health };
