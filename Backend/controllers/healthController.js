const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'HomeEase API is running',
    timestamp: new Date().toISOString(),
  })
}

export { getHealth }
