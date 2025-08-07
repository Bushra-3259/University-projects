import cv2  # OpenCV library for image processing
import numpy as np  # NumPy for numerical operations
import streamlit as st  # Streamlit for building the app interface
from tensorflow.keras.applications.mobilenet_v2 import (  # Importing MobileNetV2 model for image classification
    MobileNetV2,  # deep learning model for image classification 
    preprocess_input,  # Preprocessing function for the input image
    decode_predictions  # Function to decode the model predictions
)
from PIL import Image  # PIL (Pillow) for handling images
import base64  # Base64 module for encoding image data

# ✅ Set page config (must be first Streamlit command)
st.set_page_config(
    page_title="AI Image Classifier",  # Title of the web page
    page_icon="🧠",  # Icon displayed on the browser tab
    layout="centered"  # Layout of the app (centered content)
)

# 🔧 Convert local background image to base64
def get_base64_image(image_path): #base64 for encoding binary data
    """Converts an image to a base64 string."""
    with open(image_path, "rb") as f:  # Open the image file in binary mode
        data = f.read()  # Read the image data
    return base64.b64encode(data).decode()  # Encode image data to base64 and return it as a string

# 📷 Load and encode local image file (name must be background.png)
bg_image = get_base64_image("background.png")  # Get the base64-encoded string of the background image

# 🎨 Inject CSS with background and layout styling. markdown displays a different language text 
st.markdown(f"""
<style>
    .stApp {{
        background: linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), /* Adjusted opacity to 0.5 */
                    url("data:image/jpeg;base64,{bg_image}");  /* Background image set with base64 string */
        background-size: cover;  /* Ensures the image covers the screen */
        background-position: center;  /* Centers the image */
    }}
    .main-title {{
        font-size: 2.5rem;  /* Font size of the main title */
        font-weight: 600;  /* Bold font */
        color: #1f3b8b;  /* Dark blue color for the title */
        text-align: center;  /* Center-align the title */
        margin-top: 2rem;  /* Margin from top */
    }}
    .description {{
        font-size: 1.1rem;  /* Font size of the description */
        color: #333;  /* Dark grey color for the description text */
        text-align: center;  /* Center-align the description */
    }}
    .st-card {{
        border-radius: 15px;  /* Rounded corners for the card */
        padding: 25px;  /* Padding inside the card */
        margin-top: 20px;  /* Margin from the top */
    }}
    .st-card:hover {{
        transform: scale(1.01);  /* Slight scaling effect on hover */
        transition: transform 0.2s;  /* Smooth transition for the scaling effect */
    }}
    .prediction-item {{
        font-size: 1.1rem;  /* Font size of each prediction */
        margin-bottom: 8px;  /* Margin between prediction items */
    }}
    .label {{
        font-weight: bold;  /* Bold label for predictions */
        color: #0c6efd;  /* Blue color for labels */
    }}
</style>
""", unsafe_allow_html=True)  # Inject the CSS into the app using markdown for custom styling

# 🧠 Load model with cache
@st.cache_resource  # Caching the model loading for performance improvement
def load_model():
    """Load and return the MobileNetV2 model pre-trained on ImageNet."""
    return MobileNetV2(weights="imagenet")  # Load the MobileNetV2 model with pre-trained weights on ImageNet

# 🔄 Preprocess the uploaded image
def preprocess_image(image):
    """Preprocess the uploaded image for classification."""
    img = np.array(image)  # Convert the image into a NumPy array
    if img.shape[2] == 4:  # If the image has an alpha channel (RGBA)
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)  # Convert it to RGB (removing the alpha channel)
    img = cv2.resize(img, (224, 224))  # Resize the image to 224x224 pixels (input size required by MobileNetV2)
    img = preprocess_input(img)  # Preprocess the image to be compatible with the model
    return np.expand_dims(img, axis=0)  # Add an extra dimension to the image array (batch dimension)

# 🔍 Make predictions
def classify_image(model, image):
    """Classify the uploaded image using the model."""
    try:
        img = preprocess_image(image)  # Preprocess the uploaded image
        preds = model.predict(img)  # Make predictions using the model
        decoded = decode_predictions(preds, top=3)[0]  # Decode the predictions and get top-3 results
        result = [f"<span class='label'>{label}</span>: {score:.2%}" for _, label, score in decoded]  # Format predictions for display
        return result, decoded[0][1], decoded[0][2]  # Return predictions, most likely label and description
    except Exception as e:  # If an error occurs during prediction
        st.error(f"Error: {e}")  # Display the error message in the app
        return None, None, None  # Return None if there's an error

# 🚀 Streamlit App Logic
def main():
    """Main logic for running the Streamlit app."""
    # Sidebar content
    with st.sidebar:
        st.header("🌟 About This App")  # Sidebar header
        st.markdown(""" 
        🤖 **AI-Powered Image Classifier**  
        Upload any image and discover what the AI sees instantly.  
        \nPowered by **MobileNetV2**, a deep learning model trained on 1,000+ object categories.
        """)  # About section explaining the app

    # Main title and description
    st.markdown("<div class='main-title'>🧠 AI Image Classifier</div>", unsafe_allow_html=True)  # Main title in the app
    st.markdown("<div class='description'>Upload a photo and let the AI guess what's inside! 🚀</div>", unsafe_allow_html=True)  # Description text

    model = load_model()  # Load the pre-trained model
    uploaded_file = st.file_uploader("📁 Upload an image", type=["jpg", "jpeg", "png"])  # File uploader widget to upload image

    if uploaded_file:  # If an image is uploaded
        col1, col2 = st.columns([1, 1])  # Create two columns for image preview and classification results
        with col1:
            st.image(uploaded_file, caption="🖼️ Preview", use_container_width=True)  # Display the uploaded image with use_container_width

        with col2:
            if st.button("🔍 Classify Image"):  # When the "Classify Image" button is pressed
                with st.spinner("Analyzing with AI..."):  # Show a loading spinner while processing
                    image = Image.open(uploaded_file)  # Open the uploaded image
                    predictions, object_name, description = classify_image(model, image)  # Get predictions from the model

                    if predictions:  # If predictions are available
                        st.markdown('<div class="st-card">', unsafe_allow_html=True)  # Display predictions in a styled card
                        st.subheader("🔮 Top Predictions")  # Subheader for predictions section
                        for p in predictions:  # Loop through the predictions and display them
                            st.markdown(f"<div class='prediction-item'>{p}</div>", unsafe_allow_html=True)
                        st.subheader("✅ Most Likely")  # Display the most likely prediction
                        st.success(f"**{object_name}** — *{description}*")  # Display the most likely object with description
                        st.markdown('</div>', unsafe_allow_html=True)  # Close the card

if __name__ == "__main__":  # If the script is run directly (not imported)
    main()  # Run the app
