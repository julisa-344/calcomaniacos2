import React, { useState, useEffect } from 'react';
import HeroComponent from "../components/HeroComponent";
import RegisterModal from "../components/RegisterModal";
import { useAuth } from '../AuthContext';

function HomePage() {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!user) {
            setShowModal(true);
        }
    }, [user]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <main className="bg-color">
                <HeroComponent />
                {showModal && <RegisterModal onClose={handleCloseModal} />}
            </main>
        </>
    );
}

export default HomePage;