import React, { useState, useRef, useEffect } from "react";

const applications = [
    {
        id: 1,
        title: "Medical Imaging",
        description: "Used to analyze X-rays, MRI, and CT scans for disease detection and diagnosis."
    },
    {
        id: 2,
        title: "Facial Recognition",
        description: "Helps in identifying individuals for security and authentication."
    },
    {
        id: 3,
        title: "Agriculture",
        description: "Monitors crop health and detects pests using drone-captured images."
    },
    {
        id: 4,
        title: "Autonomous Vehicles",
        description: "Detects objects, lanes, and signs to help self-driving cars navigate safely."
    },
];

const ImageApplications = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const anchorsRef = useRef([]);
    const containerRef = useRef(null);

    // Handle click on title
    const handleTitleClick = (index) => {
        setActiveIndex(index);

        // Scroll to the corresponding anchor with top alignment
        if (anchorsRef.current[index]) {
            anchorsRef.current[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'  // Align to top of viewport
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const scrollPosition = containerRef.current.scrollTop;
                console.log(`Container scroll position: ${scrollPosition}`);

                // Log positions of each anchor element
                anchorsRef.current.forEach((anchor, index) => {
                    if (anchor) {
                        const topPosition = anchor.getBoundingClientRect().top;
                        console.log(`Anchor ${index} top position: ${topPosition}`);
                    }
                });
            }
        };

        // Add scroll event listener to the container
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        // Clean up the event listener
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div className='nexus' ref={containerRef}>
            <div className='themeTrigger'></div>

            <div className='nexusSticky'>
                <div className='nexusTop'>
                    <div className='perspectiveTransition title textTitleSection'>
                        <div className="perspectiveTransition__content">
                            <div className='ink-trap'>
                                <h2 className='text-[107px]'>THE POWER OF <br /> IMAGE PROCESSING</h2>
                            </div>
                        </div>
                    </div>
                    <span>What Image Processing can do</span>
                </div>

                <ul className='nexusAttributes'>
                    {applications.map((app, i) => (
                        <React.Fragment key={app.id}>
                            <div
                                className={`nexus__scrollAnchor anchor${i}`}
                                ref={(el) => (anchorsRef.current[i] = el)}
                                style={{ top: `${i * 100}vh` }}
                            />
                            <li className={`nexusItem ${i === activeIndex ? 'active' : ''}`}>
                                <header
                                    className='nexusItem__header textCaption'
                                    onClick={() => handleTitleClick(i)}
                                >
                                    <div className='nexusItem__number'>
                                        {String(app.id).padStart(2, '0')}
                                    </div>
                                    <div className='nexusItem__title'>{app.title}</div>
                                </header>

                                <div className='nexusItem__content'>
                                    <div className="nexusItem__contentInner">
                                        <div className="nexusItem__progress">
                                            <div
                                                className='nexusItem__progressBar'
                                                style={{
                                                    transform: i === activeIndex ? 'scaleY(1)' : 'scaleY(0)',
                                                    transition: 'transform 0.5s ease'
                                                }}
                                            />
                                        </div>
                                        <p className="nexusItem__description textBody">
                                            {app.description}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </React.Fragment>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ImageApplications;
