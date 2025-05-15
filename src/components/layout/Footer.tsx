import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4">ELITE<span className="text-gold-500">DRIVE</span></h3>
            <p className="text-gray-400 mb-4">
              Experience luxury on wheels with our premium car rental service.
              We offer a curated selection of the world's finest automobiles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold-500 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gold-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-gold-500 transition">
                  Luxury Fleet
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gold-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-gold-500 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-gold-500 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-gold-500 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gold-500 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  123 Luxury Avenue, Beverly Hills, CA 90210
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gold-500 mr-2" />
                <span className="text-gray-400">+1 (800) ELITE-DRIVE</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gold-500 mr-2" />
                <span className="text-gray-400">info@elitedrive.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter to receive updates on new arrivals and special offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-gold-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-gold-500 text-gray-900 py-2 px-4 rounded hover:bg-gold-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} EliteDrive Luxury Car Rentals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;