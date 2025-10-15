import React from 'react';

interface LidoBannerProps {
  rewardsAddress: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export const LidoBanner: React.FC<LidoBannerProps> = ({
  rewardsAddress,
  className = '',
  variant = 'default'
}) => {
  const buildReferralUrl = () => {
    return `https://stake.lido.fi/?ref=${rewardsAddress}`;
  };

  const handleClick = () => {
    window.open(buildReferralUrl(), '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <div 
        className={`lido-banner-compact cursor-pointer ${className}`}
        onClick={handleClick}
      >
        <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Stake ETH with Lido</h3>
              <p className="text-sm opacity-90">Earn rewards while maintaining liquidity</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">5.2%</div>
              <div className="text-xs opacity-75">APY</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`lido-banner cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <svg width="100%" viewBox="0 0 665 182" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d)">
          <mask id="mask0" maskType="alpha" maskUnits="userSpaceOnUse" x="16" y="12" width="633" height="150">
            <path d="M16 32C16 20.9543 24.9543 12 36 12H629C640.046 12 649 20.9543 649 32V142C649 153.046 640.046 162 629 162H36C24.9543 162 16 153.046 16 142V32Z" fill="url(#paint0_linear)"/>
          </mask>
          <g mask="url(#mask0)">
            <path d="M16.5 32C16.5 21.2304 25.2304 12.5 36 12.5H629C639.77 12.5 648.5 21.2304 648.5 32V142C648.5 152.77 639.77 161.5 629 161.5H36C25.2305 161.5 16.5 152.77 16.5 142V32Z" fill="url(#paint1_linear)" stroke="white"/>
            <g filter="url(#filter1_f)">
              <circle cx="91" cy="141" r="244" fill="url(#paint2_radial)"/>
            </g>
            <circle opacity="0.5" cx="91" cy="87" r="149" fill="url(#paint3_linear)"/>
            <circle cx="91" cy="87" r="45" fill="url(#paint4_linear)"/>
            <path d="M90.6413 93.4223L74.5291 84.2189L74.0891 84.8939C69.1266 92.5065 70.2349 102.476 76.7537 108.864C84.4248 116.38 96.862 116.38 104.533 108.864C111.052 102.476 112.16 92.5065 107.198 84.8939L106.758 84.2188L90.6413 93.4223Z" fill="url(#paint5_radial)"/>
            <path opacity="0.6" d="M90.6624 72.8652L76.7734 80.8069L90.6624 88.7386L104.541 80.807L90.6624 72.8652Z" fill="url(#paint6_radial)"/>
            <path d="M90.68 74.9375L74.541 84.2238L90.6439 93.4315L106.762 84.2208L90.68 74.9375Z" fill="url(#paint7_diamond)"/>
            <path d="M90.6624 59.5137L76.7734 80.8099L90.6624 88.7416V59.5137Z" fill="url(#paint8_linear)"/>
            <path d="M90.6602 88.7398L104.55 80.8068L90.6609 59.5L90.6602 88.7398Z" fill="url(#paint9_linear)"/>
          </g>
          <path d="M172.84 69.3C171.78 69.3 170.817 69.11 169.95 68.73C169.09 68.35 168.387 67.8067 167.84 67.1C167.293 66.3933 166.947 65.56 166.8 64.6L169.64 64.18C169.773 64.72 170.003 65.1867 170.33 65.58C170.657 65.9667 171.05 66.26 171.51 66.46C171.977 66.66 172.48 66.76 173.02 66.76C173.48 66.76 173.92 66.69 174.34 66.55C174.76 66.4033 175.1 66.19 175.36 65.91C175.627 65.63 175.76 65.3 175.76 64.92C175.76 64.6 175.657 64.32 175.45 64.08C175.243 63.84 174.88 63.64 174.36 63.48L170.62 62.38C170.073 62.2267 169.57 62.03 169.11 61.79C168.657 61.55 168.25 61.17 167.89 60.65C167.537 60.13 167.36 59.4533 167.36 58.62C167.36 57.6933 167.593 56.9067 168.06 56.26C168.533 55.6133 169.17 55.13 169.97 54.81C170.777 54.4833 171.68 54.32 172.68 54.32C174.187 54.32 175.443 54.6867 176.45 55.42C177.463 56.1467 178.147 57.1867 178.5 58.54L175.56 59.04C175.453 58.5733 175.25 58.1767 174.95 57.85C174.657 57.5233 174.303 57.2767 173.89 57.11C173.483 56.9433 173.05 56.86 172.59 56.86C172.17 56.86 171.78 56.9267 171.42 57.06C171.06 57.1933 170.77 57.3833 170.55 57.63C170.33 57.8767 170.22 58.16 170.22 58.48C170.22 58.9 170.393 59.2233 170.74 59.45C171.087 59.6767 171.553 59.8667 172.14 60.02L174.64 60.7C175.353 60.8933 175.983 61.1167 176.53 61.37C177.083 61.6233 177.57 62.0233 177.99 62.57C178.41 63.1167 178.62 63.8333 178.62 64.72C178.62 65.7067 178.35 66.5467 177.81 67.24C177.277 67.9267 176.57 68.4433 175.69 68.79C174.81 69.13 173.86 69.3 172.84 69.3Z" fill="#273852"/>
            <path opacity="0.8" d="M173.35 100H166.98V89.92H173.35V91.103H168.226V94.26H172.51V95.443H168.226V98.817H173.35V100Z" fill="#273852"/>
          </g>
        </g>
        <defs>
          <filter id="filter0_d" x="0" y="0" width="665" height="182" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="8"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
          </filter>
          <filter id="filter1_f" x="-337" y="-287" width="856" height="856" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="92" result="effect1_foregroundBlur"/>
          </filter>
          <linearGradient id="paint0_linear" x1="332.5" y1="12" x2="332.5" y2="162" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F3827B"/>
            <stop offset="1" stopColor="#EBC5A1"/>
          </linearGradient>
          <linearGradient id="paint1_linear" x1="332.5" y1="12" x2="332.5" y2="162" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F3827B"/>
            <stop offset="1" stopColor="#EBC5A1"/>
          </linearGradient>
          <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(91 141) rotate(-90) scale(244)">
            <stop offset="0.648854" stopColor="#FFEFBE"/>
            <stop offset="1" stopColor="#FFEFBE" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="paint3_linear" x1="91" y1="-62" x2="91" y2="236" gradientUnits="userSpaceOnUse">
            <stop stopColor="white"/>
            <stop offset="1" stopColor="white" stopOpacity="0"/>
            <stop offset="1" stopColor="white" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="paint4_linear" x1="91" y1="42" x2="91" y2="132" gradientUnits="userSpaceOnUse">
            <stop stopColor="white"/>
            <stop offset="1" stopColor="white" stopOpacity="0.5"/>
          </linearGradient>
          <radialGradient id="paint5_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(90.6258 114.515) rotate(-90) scale(26.1456 34.1709)">
            <stop offset="0.203695" stopColor="#56F2FF"/>
            <stop offset="1" stopColor="#4A8CEA"/>
          </radialGradient>
          <radialGradient id="paint6_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(90.6574 80.8019) rotate(90.1607) scale(7.91522 14.9853)">
            <stop stopColor="#EEFF83"/>
            <stop offset="0.689596" stopColor="#5699EC"/>
          </radialGradient>
          <radialGradient id="paint7_diamond" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(90.6515 84.1845) rotate(90.16) scale(9.22198 17.3885)">
            <stop stopColor="#56F2FF"/>
            <stop offset="1" stopColor="#5699EC"/>
          </radialGradient>
          <linearGradient id="paint8_linear" x1="83.7179" y1="59.5137" x2="83.7179" y2="88.7416" gradientUnits="userSpaceOnUse">
            <stop offset="0.377179" stopColor="#FFE336"/>
            <stop offset="1" stopColor="#13C0B6" stopOpacity="0.7"/>
          </linearGradient>
          <linearGradient id="paint9_linear" x1="97.6053" y1="59.5" x2="97.6053" y2="88.7398" gradientUnits="userSpaceOnUse">
            <stop offset="0.408817" stopColor="#FF7F72"/>
            <stop offset="1" stopColor="#2978EF" stopOpacity="0.7"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LidoBanner;
