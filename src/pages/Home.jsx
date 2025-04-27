
import imageDefinition from "../assets/homepage-defintion.jpg"
import logo from "../assets/final-logo.png"
import Hero from "../components/Hero"
import ImageApplications from "../components/ImageApplications"
import ImageTechniques from "../components/ImageTechniques";
import ImageProcessingShowcase from "../components/ImageProcessingShowcase";



const techniques = [
    {
        title: "Image Acquisition",
        description: "Capturing images from the real world into digital form.",
        icon: "📷",
    },
    {
        title: "Image Filtering & Enhancement",
        description: "Improving image quality by reducing noise and enhancing details.",
        icon: "✨",
    },
    {
        title: "Image Restoration",
        description: "Reconstructing corrupted or damaged images.",
        icon: "🛠️",
    },
    {
        title: "Color Image Processing",
        description: "Handling and analyzing images in color spaces.",
        icon: "🎨",
    },
    {
        title: "Wavelets and Other Image Transforms",
        description: "Transforming images for better analysis and compression.",
        icon: "🔄",
    },
    {
        title: "Compression and Watermarking",
        description: "Reducing file size and embedding copyright marks.",
        icon: "💾",
    },
    {
        title: "Morphological Processing",
        description: "Analyzing shapes and structures in binary images.",
        icon: "🧩",
    },
    {
        title: "Segmentation",
        description: "Dividing an image into meaningful parts.",
        icon: "✂️",
    },
    {
        title: "Feature Extraction",
        description: "Detecting important patterns or structures from images.",
        icon: "🔍",
    },
    {
        title: "Image Pattern Classification",
        description: "Categorizing images based on their features.",
        icon: "🧠",
    },
];


const Home = () => {
    return (
        <div className="text-center relative h-full w-full">
            <Hero />
            <div className="flex items-center my-[5rem] aboutSection mx-[8rem]">
                <div className="flex flex-col text-left  gap-2 aboutContent mr-10">
                    <img src={logo} width={100} alt="" />
                    <div>
                        <h2 className="text-[56px] font-bold tracking-[-2px]">What is the Virtual Lab</h2>
                        <span className="text-[#888888] text-[36px] tracking-[-2px] font-bold">Everything you need to provide great images.</span>
                    </div>
                    <p className="text-[18px]">Is the one and only educational platform for learning Image Processing Techniques, manipulation and analysis of <br /> images using mathematical operations, algorithms, and techniques to:</p>
                    <ul className="text-[18px] list-disc marker:text-green">
                        <li>Improve their quality.</li>
                        <li>Extract meaningful information.</li>
                        <li>Transform them into a different format.</li>
                    </ul>
                </div>
                <img className="rounded-[10px] aboutSectionImg" src={imageDefinition} alt="" />

            </div>
            <ImageApplications />
            <ImageTechniques />
            <ImageProcessingShowcase />

        </div>
    )
}

export default Home
