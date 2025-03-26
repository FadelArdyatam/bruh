import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  shimmerColors?: string[];
}

const SkeletonLoader: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  shimmerColors = ['#f2f2f2', '#e0e0e0', '#f2f2f2'],
}) => {
  const translateX = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 300,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [translateX]);

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#e0e0e0',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          style={{ width: '200%', height: '100%' }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={shimmerColors}
        />
      </Animated.View>
    </View>
  );
};

// Komponen-komponen turunan untuk penggunaan yang lebih mudah
export const SkeletonBox = (props: SkeletonProps) => <SkeletonLoader {...props} />;

export const SkeletonCircle = (props: SkeletonProps) => (
  <SkeletonLoader
    width={props.width || 48}
    height={props.height || 48}
    borderRadius={props.width ? Number(props.width) / 2 : 24}
    {...props}
  />
);

export const SkeletonText = (props: SkeletonProps) => (
  <SkeletonLoader height={props.height || 16} {...props} />
);

// Komponen-komponen untuk kebutuhan khusus
export const ProfileSkeleton = () => (
  <View style={{ padding: 20, gap: 16 }}>
    <View style={{ alignItems: 'center', marginBottom: 20 }}>
      <SkeletonCircle width={80} height={80} />
      <SkeletonText width={150} style={{ marginTop: 8 }} />
      <SkeletonText width={100} style={{ marginTop: 4 }} />
    </View>
    
    <View style={{ gap: 12 }}>
      {[...Array(6)].map((_, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SkeletonCircle width={40} height={40} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <SkeletonText width="50%" />
            <SkeletonText width="70%" style={{ marginTop: 4 }} />
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const CardSkeleton = () => (
  <View style={{ 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 16, 
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }}>
    <SkeletonText width="60%" height={24} />
    <View style={{ height: 12 }} />
    <SkeletonText width="100%" />
    <SkeletonText width="100%" style={{ marginTop: 8 }} />
    <SkeletonText width="80%" style={{ marginTop: 8 }} />
    <View style={{ height: 16 }} />
    <SkeletonBox height={180} borderRadius={12} />
  </View>
);

export const ListItemSkeleton = () => (
  <View style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
    <SkeletonCircle width={50} height={50} />
    <View style={{ marginLeft: 12, flex: 1, justifyContent: 'center' }}>
      <SkeletonText width="60%" />
      <SkeletonText width="40%" style={{ marginTop: 6 }} />
    </View>
    <SkeletonCircle width={24} height={24} style={{ alignSelf: 'center' }} />
  </View>
);

export const IMTChartSkeleton = () => (
  <View>
    <SkeletonText width="40%" height={24} />
    <View style={{ height: 16 }} />
    <SkeletonBox height={220} borderRadius={12} />
    <View style={{ height: 12 }} />
    <SkeletonText width="70%" />
  </View>
);

export const HomeSkeleton = () => (
  <View style={{ padding: 16, gap: 20 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View>
        <SkeletonText width={100} />
        <SkeletonText width={150} height={30} style={{ marginTop: 4 }} />
      </View>
      <SkeletonCircle width={48} height={48} />
    </View>
    
    <SkeletonBox height={100} borderRadius={16} />
    
    <View>
      <SkeletonText width={120} height={24} />
      <View style={{ height: 16 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[...Array(2)].map((_, index) => (
          <SkeletonBox 
            key={index} 
            width="48%" 
            height={80} 
            borderRadius={12} 
          />
        ))}
      </View>
      <View style={{ height: 12 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[...Array(2)].map((_, index) => (
          <SkeletonBox 
            key={index} 
            width="48%" 
            height={80} 
            borderRadius={12} 
          />
        ))}
      </View>
    </View>
    
    <SkeletonBox height={220} borderRadius={16} />
    
    <View>
      <SkeletonText width={140} height={24} />
      <View style={{ height: 16 }} />
      {[...Array(3)].map((_, index) => (
        <View key={index} style={{ flexDirection: 'row', marginBottom: 16 }}>
          <SkeletonCircle width={48} height={48} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <SkeletonText width="70%" />
            <SkeletonText width="40%" style={{ marginTop: 4 }} />
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <SkeletonText width={60} />
            <SkeletonText width={40} style={{ marginTop: 4 }} />
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const TrainingSkeleton = () => (
  <View style={{ padding: 16, gap: 20 }}>
    <View style={{ flexDirection: 'row', marginBottom: 12, justifyContent: 'space-around' }}>
      {[...Array(3)].map((_, index) => (
        <SkeletonBox key={index} width={100} height={140} borderRadius={12} />
      ))}
    </View>
    
    <CardSkeleton />
    
    <View>
      <SkeletonText width={120} height={24} />
      <View style={{ height: 12 }} />
      <View style={{ gap: 8 }}>
        <SkeletonBox height={56} borderRadius={28} />
        <SkeletonBox height={56} borderRadius={28} />
        <SkeletonBox height={56} borderRadius={28} />
      </View>
    </View>
  </View>
);

export const FoodRecallSkeleton = () => (
  <View style={{ padding: 16, gap: 16 }}>
    <SkeletonText width={180} height={28} />
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <SkeletonBox width="48%" height={48} borderRadius={24} />
      <SkeletonBox width="48%" height={48} borderRadius={24} />
    </View>
    
    <SkeletonBox height={56} borderRadius={28} />
    
    <View>
      <SkeletonText width={140} height={24} />
      <View style={{ height: 12 }} />
      <SkeletonBox height={200} borderRadius={12} />
    </View>
    
    <View>
      <SkeletonText width={180} height={24} />
      <View style={{ height: 12 }} />
      {[...Array(3)].map((_, index) => (
        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <SkeletonText width="80%" />
            <SkeletonText width="60%" style={{ marginTop: 4 }} />
          </View>
          <View style={{ flexDirection: 'row', width: 100, justifyContent: 'space-between' }}>
            <SkeletonCircle width={24} height={24} />
            <SkeletonText width={30} />
            <SkeletonCircle width={24} height={24} />
          </View>
        </View>
      ))}
      
      <SkeletonBox height={70} borderRadius={12} style={{ marginTop: 12 }} />
    </View>
    
    <SkeletonBox height={56} borderRadius={28} />
  </View>
);

export default SkeletonLoader;