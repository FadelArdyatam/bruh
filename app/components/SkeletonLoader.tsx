import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: ViewStyle;
    shimmerColors?: readonly [string, string, ...string[]]
}

/**
 * Komponen dasar SkeletonLoader yang menampilkan efek shimmer
 */
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
                    width: typeof width === 'number' ? width : parseInt(width, 10),
                    height: typeof height === 'number' ? height : parseInt(height, 10),
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

/**
 * SkeletonBox - Komponen untuk menampilkan kotak skeleton sederhana
 */
export const SkeletonBox: React.FC<SkeletonProps> = (props) => <SkeletonLoader {...props} />;

/**
 * SkeletonCircle - Komponen untuk menampilkan lingkaran skeleton
 */
export const SkeletonCircle: React.FC<SkeletonProps> = (props) => (
    <SkeletonLoader
        width={props.width || 48}
        height={props.height || 48}
        borderRadius={props.width ? Number(props.width) / 2 : 24}
        {...props}
    />
);

/**
 * SkeletonText - Komponen untuk menampilkan teks skeleton
 */
export const SkeletonText: React.FC<SkeletonProps> = (props) => (
    <SkeletonLoader height={props.height || 16} {...props} />
);

// Komponen-komponen untuk screen-specific skeletons

/**
 * ProfileSkeleton - Skeleton untuk halaman profil
 */
export const ProfileSkeleton: React.FC = () => (
    <View style={styles.container}>
        <View style={styles.profileHeader}>
            <SkeletonCircle width={80} height={80} />
            <SkeletonText width={150} style={{ marginTop: 8 }} />
            <SkeletonText width={100} style={{ marginTop: 4 }} />
        </View>

        <View style={styles.infoSection}>
            {[...Array(6)].map((_, index) => (
                <View key={index} style={styles.infoItem}>
                    <SkeletonCircle width={40} height={40} />
                    <View style={styles.infoTexts}>
                        <SkeletonText width="50%" />
                        <SkeletonText width="70%" style={{ marginTop: 4 }} />
                    </View>
                </View>
            ))}
        </View>
    </View>
);

/**
 * CardSkeleton - Skeleton untuk card
 */
export const CardSkeleton: React.FC = () => (
    <View style={styles.card}>
        <SkeletonText width="60%" height={24} />
        <View style={{ height: 12 }} />
        <SkeletonText width="100%" />
        <SkeletonText width="100%" style={{ marginTop: 8 }} />
        <SkeletonText width="80%" style={{ marginTop: 8 }} />
        <View style={{ height: 16 }} />
        <SkeletonBox height={180} borderRadius={12} />
    </View>
);

/**
 * ListItemSkeleton - Skeleton untuk item dalam daftar
 */
export const ListItemSkeleton: React.FC = () => (
    <View style={styles.listItem}>
        <SkeletonCircle width={50} height={50} />
        <View style={styles.listTexts}>
            <SkeletonText width="60%" />
            <SkeletonText width="40%" style={{ marginTop: 6 }} />
        </View>
        <SkeletonCircle width={24} height={24} style={{ alignSelf: 'center' }} />
    </View>
);

/**
 * IMTChartSkeleton - Skeleton untuk chart IMT
 */
export const IMTChartSkeleton: React.FC = () => (
    <View>
        <SkeletonText width="40%" height={24} />
        <View style={{ height: 16 }} />
        <SkeletonBox height={220} borderRadius={12} />
        <View style={{ height: 12 }} />
        <SkeletonText width="70%" />
    </View>
);


export const FoodRecallSkeleton: React.FC = () => (
    <View style={styles.foodRecallContainer}>
        <SkeletonText width={180} height={28} style={{ marginBottom: 16 }} />
        <View style={styles.daySelector}>
            <SkeletonBox width="48%" height={48} borderRadius={24} />
            <SkeletonBox width="48%" height={48} borderRadius={24} />
        </View>

        <SkeletonBox height={56} borderRadius={28} style={{ marginVertical: 16 }} />

        <View style={styles.foodSection}>
            <SkeletonText width={140} height={24} style={{ marginBottom: 12 }} />
            <SkeletonBox height={200} borderRadius={12} />
        </View>

        <View style={styles.selectedFoodSection}>
            <SkeletonText width={180} height={24} style={{ marginBottom: 12 }} />
            {[...Array(3)].map((_, index) => (
                <View key={index} style={styles.foodItem}>
                    <View style={{ flex: 1 }}>
                        <SkeletonText width="80%" />
                        <SkeletonText width="60%" style={{ marginTop: 4 }} />
                    </View>
                    <View style={styles.quantityControls}>
                        <SkeletonCircle width={24} height={24} />
                        <SkeletonText width={30} style={{ marginHorizontal: 8 }} />
                        <SkeletonCircle width={24} height={24} />
                    </View>
                </View>
            ))}

            <SkeletonBox height={70} borderRadius={12} style={{ marginTop: 12 }} />
        </View>

        <SkeletonBox height={56} borderRadius={28} style={{ marginTop: 16 }} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 16
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20
    },
    infoSection: {
        gap: 12
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoTexts: {
        marginLeft: 12,
        flex: 1
    },
    card: {
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
    },
    listItem: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    listTexts: {
        marginLeft: 12,
        flex: 1,
        justifyContent: 'center'
    },
    homeContainer: {
        padding: 16,
        gap: 20
    },
    homeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    statsSection: {
        marginBottom: 20
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    activitySection: {
        gap: 12
    },
    activityItem: {
        flexDirection: 'row',
        marginBottom: 16
    },
    activityTexts: {
        marginLeft: 12,
        flex: 1
    },
    activityStats: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    trainingContainer: {
        padding: 16,
        gap: 20
    },
    workoutCarousel: {
        flexDirection: 'row',
        marginBottom: 12
    },
    trainingSection: {
        gap: 12
    },
    foodRecallContainer: {
        padding: 16,
        gap: 16
    },
    daySelector: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    foodSection: {
        marginBottom: 16
    },
    selectedFoodSection: {
        gap: 12
    },
    foodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    quantityControls: {
        flexDirection: 'row',
        width: 100,
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default SkeletonLoader;