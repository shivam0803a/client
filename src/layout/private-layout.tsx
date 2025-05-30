import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./siderbar";
import { getCurrentUser } from "../api-service/user-services";
import { message } from "antd";
import userGlobelStore, { UsersStoreType } from "../store/user-store";
import Spinner from "../components/spinner";

function PrivatLayout({ children }: { children: React.ReactNode }) {
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setCurrentUser, currentUser }: UsersStoreType =
    userGlobelStore() as UsersStoreType;

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      setCurrentUser(response.data);
    } catch (error: any) {
      message.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    } else {
      getData();
      setShowContent(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    showContent &&
    currentUser && (
      <div className="flex lg:flex-row flex-col gap-5 h-screen">
        <Sidebar />
        <div className="flex-1 px-10 lg:mt-10 pb-10 overflow-y-scroll">{children}</div>
      </div>
    )
  );
}

export default PrivatLayout;
