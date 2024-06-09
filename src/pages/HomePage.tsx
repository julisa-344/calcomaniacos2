import MakeCollection from "../components/MakeCollectionComponent";
import HeroComponent from "../components/HeroComponent";

function HomePage() {
    return (
        <>
            <main className="bg-color">
                    <HeroComponent />
                    <MakeCollection />
            </main>
        </>
    );
}
export default HomePage;