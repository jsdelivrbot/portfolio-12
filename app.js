const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

let app = express();

app
	.use(express.static(path.join(__dirname, 'public')))
	.get('/', (req, res) => res.render('pages/index'))
	.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));