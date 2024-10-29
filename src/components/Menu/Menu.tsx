"use client";

import { useRef, useEffect, useState } from "react";
import ItemDetails from "../ItemDetails/ItemDetails";
import PizzaImage from "../../assets/images/categories/pizza.webp";
import "./Style.scss";
import axios from "axios";
import { Settings } from "../../Settings";
import Loading from "../Loading/Loading";

import { useLocation } from "react-router-dom";

const Menu = () => {
  const restaurantName = localStorage.getItem("restaurantName");
  const leftDivRef = useRef<HTMLDivElement>(null);
  const rightDivRef = useRef<HTMLDivElement>(null);
  const activeHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [menu, setMenu] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const id = queryParams.get("id");
    if (id) {
      setIsClient(true);
      initMenu(id);
    } else {
      alert("ID IS MISSING!");
    }
  }, []);

  const initMenu = async (id: string) => {
    try {
      const { data } = await axios.get(
        `${Settings.SERVERURL}restaurant/menu/${id}`
      );
      setMenu(data);
      if (data.length) {
        setActiveSection(data[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    }
  };

  useEffect(() => {
    if (isClient && rightDivRef.current) {
      const handleRightScroll = () => {
        const rightDiv = rightDivRef.current;
        if (rightDiv) {
          const sections = rightDiv.querySelectorAll(".section");
          const scrollTop = rightDiv.scrollTop;
          const divHeight = rightDiv.clientHeight;

          sections.forEach((section: Element) => {
            const sectionTop = (section as HTMLElement).offsetTop;
            const sectionHeight = section.clientHeight;

            if (
              scrollTop >= sectionTop - divHeight / 2 &&
              scrollTop < sectionTop + sectionHeight - divHeight / 2
            ) {
              setActiveSection((section as HTMLElement).dataset.title || "");
            }
          });
        }
      };

      rightDivRef.current.addEventListener("scroll", handleRightScroll);
      return () =>
        rightDivRef.current?.removeEventListener("scroll", handleRightScroll);
    }
  }, [isClient, menu]);

  useEffect(() => {
    if (isClient) {
      scrollToActiveHeading();
    }
  }, [activeSection, isClient]);

  const scrollToActiveHeading = () => {
    if (activeHeadingRef.current && leftDivRef.current) {
      const activeHeading = activeHeadingRef.current;
      const leftDiv = leftDivRef.current;
      const headingOffsetTop = activeHeading.offsetTop;
      const headingHeight = activeHeading.clientHeight;

      if (
        headingOffsetTop < leftDiv.scrollTop ||
        headingOffsetTop + headingHeight >
          leftDiv.scrollTop + leftDiv.clientHeight
      ) {
        leftDiv.scrollTo({
          top: headingOffsetTop - leftDiv.clientHeight / 2 + headingHeight / 2,
          behavior: "smooth",
        });
      }
    }
  };

  const handleClick = (heading: string) => {
    const rightDiv = rightDivRef.current;
    if (rightDiv) {
      const section = rightDiv.querySelector(
        `[data-title='${heading}']`
      ) as HTMLElement;
      if (section) {
        rightDiv.scrollTo({
          top: section.offsetTop,
          behavior: "smooth",
        });
        setActiveSection(heading);
      }
    }
  };

  if (!isClient || menu.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <header>
        <span>{restaurantName} </span>
      </header>
      <div className="container">
        <div className="menu-ui-left" ref={leftDivRef}>
          {menu.map((element: any) => (
            <div key={element.name}>
              <div
                className="menu-ui-left-item"
                ref={activeSection === element.name ? activeHeadingRef : null}
                onClick={() => handleClick(element.name)}
              >
                <span
                  className={activeSection === element.name ? "active" : ""}
                >
                  {element.name}
                </span>
              </div>
              <div className="menu-ui-element"></div>
            </div>
          ))}
        </div>

        <div className="menu-ui-right" ref={rightDivRef}>
          {menu.map((element: any) => (
            <div
              key={element.name}
              className="section"
              data-title={element.name}
            >
              <div className="category-image-container">
                <img src={PizzaImage} alt="category-image" />
              </div>
              <h2>{element.name}</h2>

              {element?.items?.length > 0 && (
                <div className="menu-ui-category-parent">
                  {element.items.map((item: any) => (
                    <ItemDetails key={item.id} item={item} />
                  ))}
                </div>
              )}

              {element?.subCategory?.map((subcategory: any) => (
                <div key={subcategory.id} className="menu-ui-list-container">
                  <div className="menu-ui-subcategory-container">
                    <span className="menu-ui-subcategory">
                      {subcategory.name}
                    </span>
                  </div>
                  {subcategory?.items?.map((item: any) => (
                    <ItemDetails key={item.id} item={item} />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <footer>
        <div>
          <span>Menu By U4R.in</span>
        </div>
        <div className="menu-ui-contact">
          <svg
            height={15}
            width={15}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 175.216 175.552"
          >
            <defs>
              <linearGradient
                id="b"
                x1="85.915"
                x2="86.535"
                y1="32.567"
                y2="137.092"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#57d163" />
                <stop offset="1" stop-color="#23b33a" />
              </linearGradient>
              <filter
                id="a"
                width="1.115"
                height="1.114"
                x="-.057"
                y="-.057"
                color-interpolation-filters="sRGB"
              >
                <feGaussianBlur stdDeviation="3.531" />
              </filter>
            </defs>
            <path
              fill="#b3b3b3"
              d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0"
              filter="url(#a)"
            />
            <path
              fill="#fff"
              d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
            />
            <path
              fill="url(#linearGradient1780)"
              d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
            />
            <path
              fill="url(#b)"
              d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
            />
            <path
              fill="#fff"
              fill-rule="evenodd"
              d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
            />
          </svg>
          <a href="#"> Contact US</a>
        </div>
      </footer>
    </>
  );
};

export default Menu;
