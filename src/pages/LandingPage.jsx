import { Link } from 'react-router-dom';
import banner from '../assets/banner-img.png';

export default function LandingPage() {
  return (
    <div className="pt-18 w-full"> {/* Added padding-top for fixed navbar */}
       
      {/* Hero Banner */}
      <section className="flex-center-col md:flex-row lg:h-full md:h-80 sm:h-110 h-120 bg-dark-teal text-white  px-8">
        <img src={banner} alt="Banner" className="w-50 lg:w-2/6 md:w-1/3 sm:w-1/3"/>
        <div className="md:w-1/2 text-center md:text-left lg:ml-10 md:ml-5 sm:ml-2">
          <h2 className="lg:text-4xl text-3xl font-bold mb-4">
            <span className="text-aquamarine">Trust us, </span>
            <span className="text-lightblue">your liver
            will <span className="text-aquamarine"> thank you! </span></span>
          </h2><br />

          <p className="lg:text-xl md:text-lg font-medium italic mb-4">We help track your meds, not your browser history, you're safe here :)</p><br />
          <Link to="/register" className="link">
            Register Now
          </Link>
        </div>
      </section><br />

      {/* About MediTrack */}
      <section id="about" ></section><br /><br />
      <div className="p-8 text-center max-w-4xl mx-auto ">
        <h3 className="sub-head">About MediTrack</h3><br />
        <p className="text-gray-700">
            MediTrack bridges the gap between doctors and patients by providing an organized way to track 
            prescribed medications and schedules. With regular updates and reminders, patients stay informed 
            about their treatment, while healthcare providers can rely on better medication adherence. This 
            connection helps build trust, improves communication, and ensures that treatment plans are followed 
            properly for better health outcomes.
        </p>
      </div><br />

      {/* How It Helps */}
      <section id="helps"></section><br /><br />
      <div className="p-8 bg-gray-100 text-center">
        <h3 className="sub-head">How Medicine Tracking Helps</h3><br />
        <div className="grid md:grid-cols-3 gap-6 text-center lg:ml-10 md:ml-5 sm:ml-2 lg:mr-10 md:mr-5 sm:mr-2">
          <div>
            <div className='flex-center mb-3'>
              <svg xmlns="http://www.w3.org/2000/svg" className='mx-auto mb-3 bi bi-card-list' width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-2">Stay on Track</h4>
            <p className="text-gray-600">Get notified for every scheduled dose so you stay consistent. Helps you indicate which meals you need totake as soon as possible without needing an exact prescription paper.</p>
          </div>
          <div>
            <div className='flex-center mb-3'>
              <svg xmlns="http://www.w3.org/2000/svg" className='mx-auto mb-3 bi bi-lungs-fill' width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a.5.5 0 0 1 .5.5v5.243L9 7.1V4.72C9 3.77 9.77 3 10.72 3c.524 0 1.023.27 1.443.592.431.332.847.773 1.216 1.229.736.908 1.347 1.946 1.58 2.48.176.405.393 1.16.556 2.011.165.857.283 1.857.24 2.759-.04.867-.232 1.79-.837 2.33-.67.6-1.622.556-2.741-.004l-1.795-.897A2.5 2.5 0 0 1 9 11.264V8.329l-1-.715-1 .715V7.214c-.1 0-.202.03-.29.093l-2.5 1.786a.5.5 0 1 0 .58.814L7 8.329v2.935A2.5 2.5 0 0 1 5.618 13.5l-1.795.897c-1.12.56-2.07.603-2.741.004-.605-.54-.798-1.463-.838-2.33-.042-.902.076-1.902.24-2.759.164-.852.38-1.606.558-2.012.232-.533.843-1.571 1.579-2.479.37-.456.785-.897 1.216-1.229C4.257 3.27 4.756 3 5.28 3 6.23 3 7 3.77 7 4.72V7.1l.5-.357V1.5A.5.5 0 0 1 8 1m3.21 8.907a.5.5 0 1 0 .58-.814l-2.5-1.786A.5.5 0 0 0 9 7.214V8.33z"/>
            </svg>
            </div>
            <h4 className="text-xl font-semibold mb-2">Better Health</h4>
            <p className="text-gray-600">Consistent medication improves health outcomes over time. Because of consistent medication, illnesses can be further prevented from getting worse.</p>
          </div>
          <div>
            <div className='flex-center mb-3'>
              <svg xmlns="http://www.w3.org/2000/svg" className='mx-auto mb-3 bi bi-bell-fill' width="60" height="50" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-2">Custom Reminders</h4>
            <p className="text-gray-600">Set personalized reminders that work with your daily routine. Highlight missed doses for further tracking and practice accountability in handling your meds.</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section id="contact" className="p-8 text-center">
        <h3 className="sub-head">Contact Us</h3>
        <form className="max-w-md mx-auto space-y-4">
          <input type="text" placeholder="Your Name" className="input-design" />
          <input type="email" placeholder="Your Email" className="input-design" />
          <textarea placeholder="Your Message" className="input-design" rows="4"></textarea>
          <button type="submit" className="w-full link-reverse">Send Message</button>
        </form>
      </section>

      

    </div>
  );
}
