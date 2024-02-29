import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import ProductCard from "../../components/components/ProductCard";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getCategory, getProducts } from "../../features/product/productSlice";
import { navData } from "../../data/navItems";
import Spinner from "../../components/components/Spinner";
import GoToTop from "../../components/components/GoToTop";
import Button from "../../components/components/Button";
import { MdArrowBack } from "react-icons/md";
import { ROUTES } from "../../constants/Route";

const Catalog = () => {
  const { id } = useParams<{ id: string }>();
  const { products, isLoading } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const categoryId = id || "All";

    if (!id) {
      const newUrl = window.location.pathname + "/All";
      window.history.pushState({ path: newUrl }, "", newUrl);
    }

    const category = navData.find((item) => item.name === categoryId);
    if (category && category.value !== "all") {
      const pathUrl = ROUTES.find(
        (item) => item.name.toLowerCase() === category.value.toLowerCase()
      );
      if (pathUrl) {
        dispatch(getCategory(pathUrl.url.toLowerCase()));
      }
    } else {
      dispatch(getProducts());
    }
  }, [dispatch, id]);

  const convertedString = id
    ?.split("-")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");

  if (isLoading) return <Spinner />;
  return (
    <div className={`${styles.container} main-container`}>
      <div className={styles.titleContainer}>
        <Button className={styles.iconContainer} onClick={() => navigate(-1)}>
          <MdArrowBack className={styles.icon} />
        </Button>
        <div className={styles.title}>{convertedString}</div>
      </div>
      <div className={styles.productList}>
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            category={product.category}
            description={product.description}
            image={product.image}
          />
        ))}
      </div>
      <GoToTop />
    </div>
  );
};

export default Catalog;
