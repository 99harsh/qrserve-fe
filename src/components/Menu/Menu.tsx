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
    const [menu, setMenu] = useState<any>([])

    // Scroll event handler for right div
    const handleRightScroll = () => {
        const rightDiv = rightDivRef.current;

        if (rightDiv) {
            const sections = rightDiv.querySelectorAll(".section");

            // Get the current scroll position of the right div
            const scrollTop = rightDiv.scrollTop;
            const divHeight = rightDiv.clientHeight;

            // Loop through sections and find the one that is in view
            sections.forEach((section: any) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                // Check if the section is in the visible range of the right div
                if (
                    scrollTop >= sectionTop - divHeight / 2 &&
                    scrollTop < sectionTop + sectionHeight - divHeight / 2
                ) {
                    setActiveSection(section.dataset.title); // Set active section
                }
            });
        }
    };

    // Scroll left div to ensure active heading is in view
    const scrollToActiveHeading = () => {
        if (activeHeadingRef.current && leftDivRef.current) {
            const activeHeading = activeHeadingRef.current;
            const leftDiv = leftDivRef.current;

            const headingOffsetTop = activeHeading.offsetTop;
            const headingHeight = activeHeading.clientHeight;

            // Ensure the active heading is fully visible by checking its position
            if (
                headingOffsetTop < leftDiv.scrollTop ||
                headingOffsetTop + headingHeight >
                leftDiv.scrollTop + leftDiv.clientHeight
            ) {
                leftDiv.scrollTo({
                    top:
                        headingOffsetTop -
                        leftDiv.clientHeight / 2 +
                        headingHeight / 2, // Center the active heading in view
                    behavior: "smooth",
                });
            }
        }
    };

    // Effect to scroll to active heading whenever activeSection changes
    useEffect(() => {
        scrollToActiveHeading();
    }, [activeSection]);

    // Scroll event listener for the right div
    useEffect(() => {
        initMenu();
    }, []);

    const initMenu = async () => {
        const { data } = await axios.get(`${Settings.SERVERURL}restaurant/menu/mudoven`);
        setMenu(data);
        if (data.length) {
            const rightDiv = rightDivRef.current;
            if (rightDiv) {
                rightDiv.addEventListener("scroll", handleRightScroll);
                return () => rightDiv.removeEventListener("scroll", handleRightScroll);
            }
            setActiveSection(data[0].name)
        }
    }

    // Custom scroll function to ensure smooth scrolling without steps
    const scrollToSectionInstantly = (targetPosition: number) => {
        rightDivRef.current!.scrollTop = targetPosition;
    };

    // Handle click on the left heading to scroll to the corresponding section instantly
    const handleClick = (heading: string) => {
        const rightDiv = rightDivRef.current;
        if (rightDiv) {
            const section = rightDiv.querySelector(
                `[data-title='${heading}']`
            ) as HTMLElement;
            if (section) {
                // Get the section's top position
                const sectionTop = section.offsetTop;

                // Instantly jump to the desired section
                scrollToSectionInstantly(sectionTop);

                setActiveSection(heading); // Set the clicked section as active
            }
        }
    };

    if (menu.length === 0) {
        return (
            <div>
                <Loading />
            </div>
        )
    }

    return (
        <div className="container">
            {/* Left Div */}
            <div className="menu-ui-left" ref={leftDivRef}>
                {menu.map((element: any) => {
                    return (
                        <>
                            <div className="menu-ui-left-item"
                                key={element.name}
                                ref={
                                    activeSection === element.name
                                        ? activeHeadingRef
                                        : null
                                }
                                onClick={() => handleClick(element.name)}
                            >
                                <span

                                    className={
                                        activeSection === element.name
                                            ? "active"
                                            : ""
                                    }

                                >
                                    {element.name}
                                </span>

                            </div>

                            <div className="menu-ui-element"></div>
                        </>
                    );
                })}
            </div>

            {/* Right Div */}
            <div className="menu-ui-right" ref={rightDivRef}>
                {menu.map((element: any) => {
                    return (
                        <div
                            key={element.name}
                            className="section"
                            data-title={element.name}
                        >
                            <div className="category-image-container">
                                <img src={PizzaImage} alt="category-image" />
                            </div>
                            <h2>{element.name}</h2>

                            {
                                element?.items?.length ?
                                    <div className="menu-ui-category-parent">
                                        {
                                            element?.items?.map((item: any) => {
                                                return (
                                                    <div>
                                                        <ItemDetails item={item} />
                                                    </div>
                                                )
                                            })}
                                    </div>
                                    : ""

                            }

                            {
                                element?.subCategory?.map((subcategory: any) => {
                                    return (
                                        <div className="menu-ui-list-container">
                                            <div className="menu-ui-subcategory-container">
                                                <span className="menu-ui-subcategory">{subcategory.name}</span>
                                            </div>
                                            {
                                                subcategory?.menus?.map((item: any) => {
                                                    return (
                                                        <ItemDetails item={item} />
                                                    )
                                                })
                                            }

                                        </div>
                                    )
                                })

                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Menu;
