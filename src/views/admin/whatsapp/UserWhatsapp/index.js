import React from 'react';
import { useParams } from 'react-router-dom';

const UserWhatsapp = () => {
	const { id } = useParams();

	return <div>UserWhatsapp {id}</div>;
};

export default UserWhatsapp;
