'use client'

import { useRef, useEffect, useState } from "react";
import ItemDetails from "../ItemDetails/ItemDetails";
import PizzaImage from '../../assets/images/categories/pizza.webp';
import "./Style.scss";
import axios from "axios";
import { Settings } from "../../Settings";
import Loading from "../Loading/Loading";

const Menu = () => {
    const leftDivRef = useRef<HTMLDivElement>(null);
    const rightDivRef = useRef<HTMLDivElement>(null);
    const activeHeadingRef = useRef<HTMLHeadingElement | null>(null);
    const [activeSection, setActiveSection] = useState<string>("");
    const [menu, setMenu] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        initMenu();
    }, []);

    const initMenu = async () => {
        try {
            const { data } = await axios.get(`${Settings.SERVERURL}restaurant/menu/mudoven`);
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
            return () => rightDivRef.current?.removeEventListener("scroll", handleRightScroll);
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
                headingOffsetTop + headingHeight > leftDiv.scrollTop + leftDiv.clientHeight
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
                    behavior: "smooth"
                });
                setActiveSection(heading);
            }
        }
    };

    if (!isClient || menu.length === 0) {
        return <Loading />;
    }

    return (
        <div className="container">
            <div className="menu-ui-left" ref={leftDivRef}>
                {menu.map((element: any) => (
                    <div key={element.name}>
                        <div
                            className="menu-ui-left-item"
                            ref={activeSection === element.name ? activeHeadingRef : null}
                            onClick={() => handleClick(element.name)}
                        >
                            <span className={activeSection === element.name ? "active" : ""}>
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
                                    <span className="menu-ui-subcategory">{subcategory.name}</span>
                                </div>
                                {subcategory?.menus?.map((item: any) => (
                                    <ItemDetails key={item.id} item={item} />
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;