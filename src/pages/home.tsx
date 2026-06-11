import ChangeLanguage from "@/components/common/ChangeLanguage";
import ToggleDarkMode from "@/components/common/ToggleDarkMode";
import AllPosts from "@/features/posts/components/AllPosts";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation("common");

  return (
    <div >

      <div className="flex justify-between">
        <div>
          {t("hello")}
          <ToggleDarkMode />
        </div>
        <ChangeLanguage />
      </div>

      <section>
        <AllPosts />
      </section>
    </div>
  );
};

export default Home;
