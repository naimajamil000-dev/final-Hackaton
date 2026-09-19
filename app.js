const supabaseUrl = "https://bzkpqnpfvpqvhufrrfbb.supabase.co"
const supabaseKey = "sb_publishable_c-SfrJKU4uCUXn51MT_lew_cyn8jlXh"


const { createClient } = supabase
const supabaseClient = createClient(supabaseUrl, supabaseKey)

// console.log(client)


// ======================================
// RECIPE FORM
// ======================================

const recipeForm = document.querySelector("#recipefrom");

if (recipeForm) {

    recipeForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Get form values
        const recipeName = document.querySelector("#recipeName").value.trim();
        const category = document.querySelector("#category").value;
        const cookingTime = document.querySelector("#cookingTime").value;
        const description = document.querySelector("#description").value.trim();
        const imageFile = document.querySelector("#recipeImage").files[0];


        // ======================================
        // VALIDATION
        // ======================================

        if (!recipeName || !category || !cookingTime || !description) {
            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please fill all required fields."
            });
            return;
        }

        if (!imageFile) {
            Swal.fire({
                icon: "warning",
                title: "Image Required",
                text: "Please select a recipe image."
            });
            return;
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: "error",
                title: "Image Too Large",
                text: "Image must be less than 5MB."
            });
            return;
        }


        try {

            Swal.fire({
                title: "Publishing Recipe...",
                text: "Please wait",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });


            // ======================================
            // UNIQUE IMAGE NAME
            // ======================================

            const extension = imageFile.name
                .split(".")
                .pop()
                .toLowerCase();

            const fileName =
                Date.now() + "-" +
                Math.random().toString(36).substring(2) +
                "." +
                extension;


            // ======================================
            // UPLOAD IMAGE
            // ======================================

            const { data: uploadData, error: uploadError } =
                await supabaseClient.storage
                    .from("recipies")
                    .upload(fileName, imageFile, {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: imageFile.type
                    });

            if (uploadError) {
                console.error("Upload Error:", uploadError);
                throw uploadError;
            }


            // ======================================
            // GET IMAGE URL
            // ======================================

            const { data: urlData } =
                supabaseClient.storage
                    .from("recipies")
                    .getPublicUrl(fileName);

            const imageUrl = urlData.publicUrl;

            console.log("Image URL:", imageUrl);


            // ======================================
            // SAVE RECIPE DATA
            // ======================================

            const { error: insertError } =
                await supabaseClient
                    .from("recipes")
                    .insert({
                        recipe_name: recipeName,
                        category: category,
                        cooking_time: cookingTime,
                        description: description,
                        image_url: imageUrl
                    });

            if (insertError) {
                console.error("Database Error:", insertError);
                throw insertError;
            }


            // ======================================
            // SUCCESS
            // ======================================

            await Swal.fire({
                icon: "success",
                title: "Recipe Published!",
                text: "Recipe and image saved successfully."
            });

            recipeForm.reset();

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Error:", error);

            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: error.message
            });
        }

    });

}









// ================= SIGNUP =================

const signupForm = document.querySelector("#signupForm");

signupForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    console.log("Register button clicked");


    const name = document.querySelector("#name").value.trim();

    const email = document.querySelector("#email").value.trim();

    const password = document.querySelector("#password").value;

    const confirmPassword =
        document.querySelector("#confirmPassword").value;

    const terms = document.querySelector("#terms").checked;


    // Empty fields

    if (
        name === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        Swal.fire({
            icon: "warning",
            title: "Required Fields",
            text: "Please fill all fields."
        });

        return;
    }


    // Password check

    if (password !== confirmPassword) {

        Swal.fire({
            icon: "error",
            title: "Password Not Match",
            text: "Both passwords must be same."
        });

        return;
    }


    // Terms check

    if (!terms) {

        Swal.fire({
            icon: "warning",
            title: "Terms Required",
            text: "Please agree to the Terms of Service."
        });

        return;
    }


    try {

        console.log("Creating account...");


        // Supabase Signup

        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {
                    data: {
                        name: name
                    }
                }

            });


        console.log("Signup Data:", data);


        if (error) {

            console.log("Signup Error:", error);

            Swal.fire({
                icon: "error",
                title: "Signup Failed",
                text: error.message
            });

            return;
        }


        // Signup successful

        Swal.fire({
            icon: "success",
            title: "Account Created!",
            text: "Your account has been created successfully."
        }).then(() => {

            window.location.href = "./login.html";

        });


    } catch (error) {

        console.log("Error:", error);

        Swal.fire({
            icon: "error",
            title: "Something went wrong",
            text: error.message
        });

    }

});



// ================= LOGIN =================

const studentLogin = document.querySelector("#studentLogin");

studentLogin?.addEventListener("submit", async (event) => {

    event.preventDefault();


    const emailInput =
        document.querySelector("#email");

    const passwordInput =
        document.querySelector("#password");


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value.trim();


    if (email === "" || password === "") {

        Swal.fire({
            icon: "warning",
            title: "Required Fields",
            text: "Please enter your email and password."
        });

        return;
    }


    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.log("Login Error:", error);

            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.message
            });

            return;
        }


        console.log("Login Successful:", data);


        // Open Dashboard

        window.location.href =
            "./dashboard.html";


    } catch (error) {

        console.log(error);

    }

});



 logoutbtn.addEventListener("click",async()=>{
     const { error } = await client.auth.signOut()
if(error){
    console.log("okk");
}else{
    console.log("signout!");
    window.location.href = "index.html"
}
});


// edit delete
// UPLOAD

  const { data, error } = await client.storage
    .from("recipies")
    .upload(currentImg, uploadedFile, {
      cacheControl: "3600",
      contentType: uploadedFile.type,
      upsert: false,
    });

  if (error) {
    console.log(error)


  }

  // update
   const { dataa, errorr } = await client.storage
    .from("recipies")
    .update(currentImg, uploadedFile, {
      contentType: uploadedFile.type,
      cacheControl: "3600",
    });



// delete


deleteBtn.addEventListener("click", async () => {
  let uploadedFile = file.files[0];

  if (!uploadedFile) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No image found to delete",
    });
    return;
  }
  const { data, error } = await client.storage
    .from("images")
    .remove([currentImg]);

  uiImage.remove();

  Swal.fire({
    title: "Image Deleted Successfully!",
    icon: "success",
    draggable: true,
  });
  if (error) {
    console.log(error.message);
    return;
  }
  
  cameraImgText.innerHTML = "📸";
  heading.innerHTML = "Select Image";
  text.innerHTML = "Choose an image from your device";
});





// create recipies 


// Get elements

const recipeForms = document.querySelector("#recipeForm");
const recipeImage = document.querySelector("#recipeImage");
const imagePreview = document.querySelector("#imagePreview");


// Image Preview

recipeImage.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const imageURL = URL.createObjectURL(file);

        imagePreview.innerHTML = `
            <img src="${imageURL}" alt="Recipe Preview">
        `;
    }

});


// Create Recipe

recipeForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const title = document.querySelector("#recipeTitle").value;
    const category = document.querySelector("#category").value;
    const ingredients = document.querySelector("#ingredients").value;
    const instructions = document.querySelector("#instructions").value;
    const image = recipeImage.files[0];


    // Check image

    if (!image) {
        alert("Please upload recipe image");
        return;
    }


    // Recipe Object

    const recipe = {
        title: title,
        category: category,
        ingredients: ingredients,
        instructions: instructions,
        image: image.name
    };


    console.log("Recipe Created:", recipe);


    // Success message

    alert("Recipe created successfully!");


    // Open Dashboard

    window.location.href = "./dashboard.html";

});









