import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from 'lucide-react';

export function Footer() {
  const marketplaces = [
    { name: 'Digital Assets', href: '/marketplace' },
    { name: 'Talent Marketplace', href: '/marketplace/talent' },
    { name: 'Studio Spaces', href: '/studios' },
    { name: 'Event Tickets', href: '/tickets' }
  ];

  const services = [
    { name: 'Find Investors', href: '/investors' },
    { name: 'Legal Services', href: '/legal-services' },
    { name: 'Product Services', href: '/product-services' },
    { name: 'Education', href: '/education' }
  ];

  const company = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' }
  ];

  const support = [
    { name: 'Help Center', href: '/help' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' }
  ];

  return (
    <footer className="bg-[#171717] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2 font-title">Stay in the Creative Loop</h3>
              <p className="text-gray-400">
                Get the latest updates on new features, talent spotlights, and industry insights.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Enter your email" 
                className="flex-1 bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button className="group bg-white text-black hover:bg-gray-100">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-title">
                A
              </div>
              <span className="text-xl font-bold font-title">Artistrial</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The ultimate digital ecosystem connecting creative professionals, 
              providing tools, resources, and opportunities to bring artistic visions to life.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span>hello@artistrial.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Marketplaces */}
          <div>
            <h4 className="font-semibold mb-4 font-title">Marketplaces</h4>
            <ul className="space-y-3">
              {marketplaces.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 font-title">Services</h4>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 font-title">Company</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 font-title">Support</h4>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-gray-800" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2025 Artistrial. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

