'use client';

export const AnimatedRing = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-[500px] h-[500px] flex justify-center items-center group">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes animateRing {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes animateRing2 {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          .ring-1 {
            animation: animateRing 6s linear infinite;
          }
          .ring-2 {
            animation: animateRing 4s linear infinite;
          }
          .ring-3 {
            animation: animateRing2 10s linear infinite;
          }
          .group:hover .ring-1 {
            border-width: 6px;
            border-color: #00ff0a;
            filter: drop-shadow(0 0 20px #00ff0a);
          }
          .group:hover .ring-2 {
            border-width: 6px;
            border-color: #ff0057;
            filter: drop-shadow(0 0 20px #ff0057);
          }
          .group:hover .ring-3 {
            border-width: 6px;
            border-color: #fffd44;
            filter: drop-shadow(0 0 20px #fffd44);
          }
        `
      }} />

      {/* Ring 1 */}
      <i
        className="ring-1 absolute inset-0 border-2 border-white transition-all duration-500"
        style={{
          borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
        }}
      />
      
      {/* Ring 2 */}
      <i
        className="ring-2 absolute inset-0 border-2 border-white transition-all duration-500"
        style={{
          borderRadius: '41% 44% 56% 59%/38% 62% 63% 37%',
        }}
      />
      
      {/* Ring 3 */}
      <i
        className="ring-3 absolute inset-0 border-2 border-white transition-all duration-500"
        style={{
          borderRadius: '41% 44% 56% 59%/38% 62% 63% 37%',
        }}
      />

      {/* Content */}
      <div className="absolute w-[300px] h-full flex justify-center items-center flex-col gap-5">
        {children}
      </div>
    </div>
  );
};
