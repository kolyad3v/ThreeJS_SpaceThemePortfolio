 uniform float uSize;
 uniform float uTime;
 
 attribute float aScale;
 
 varying vec3 vColor;

 void main() 
  {  

      // position 
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    //   modelPosition.x += utime;
     float angle = atan(modelPosition.x, modelPosition.z);
            float distanceToCenter = length(modelPosition.xz);
            float angleOffset = (1.0/distanceToCenter) * uTime * 0.3;
            angle += angleOffset;
            modelPosition.x = cos(angle) * distanceToCenter * aScale;
            modelPosition.z = sin(angle) * distanceToCenter;
            
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * modelPosition;
      gl_Position = projectedPosition;

      
      gl_PointSize = uSize + aScale;
  
      // vColor
      vColor = color;
  }