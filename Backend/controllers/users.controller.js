const db = require('./../models');
const bcrypt = require('bcrypt'); //permet de chiffrer (hasher) les mots de passe de manière sécurisée.
const jwt = require('jsonwebtoken'); //bibliothèque pour générer des tokens JWT
const Users = db.users; // récupère le modèle users depuis les models (donc la table "utilisateurs" dans ta base de données).

exports.signup = async (req, res) => {
	if(!req.body.email || !req.body.password){
		return res.status(400).send({
			message: "Must have email and password"
		});
	}
	//verifie que tout et bien rentré mail et mdp sinon message erreur
	try{
		const hash = await bcrypt.hash(req.body.password, 10) //chiffre le mdp / 10 = le plus haut niveau de secu
		const user = {
			email: req.body.email,
			password: hash
		}
		await Users.create(user) // enregistre les données de user avec users.create
		return res.status(201).json({message: 'User Created'})
	}catch (err){
		return res.status(500).send({
			message: err.message
		});
	}
//si tout et bon on envoie le message crée sinon message erreur
}

exports.login = async (req, res) => {
	const user = await Users.findOne({where: {email: req.body.email}});
	if(user === null){
		return res.status(404).json({message: 'user not found'})
	}else {
		const valid = await bcrypt.compare(req.body.password, user.password)
		if(!valid){
			return res.status(401).json({ error: new Error('Not Authorized') })
		}
		return res.status(200).json({
			userId: user.id,
			token: jwt.sign(
				{userId : user.id},
				process.env.TOKEN_SECRET,
				{ expiresIn: '24h' }
			)
		})

	}
}
