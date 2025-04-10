import MainLayout from "@/Dashboard/Components/Layout/MainLayout";

const Index = ({ role }) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-6 border">Admin {role}</div>
            </div>
        </div>
    );
};

export default Index;