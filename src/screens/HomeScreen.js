import React, { useEffect, useState } from 'react'
import { View, Text, ImageBackground, Image, ScrollView, ActivityIndicator } from 'react-native'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import { COLORS, FONTS, SIZES, icons, images, dummyData } from '../constants'
import { IconButton, TextButton, VerticalCourseCard, LineDivider, CategoryCard, HorizontalCourseCard } from '../components/Card'
import { useAuth } from '../context/AuthContext';
import { useNavigation } from "@react-navigation/native";

import { getScholarProgram } from '../api/scholarshipProgramApi';
import { HorizontalList } from '../components/List'

const Section = ({ containerStyle, title, onPress, children }) => {
  return (
    <View
      style={{
        ...containerStyle
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: SIZES.padding
        }}
      >
        <Text
          style={{
            flex: 1,
            // ...FONTS.h2
            fontSize: 20, fontWeight: 'bold'
          }}
        >
          {title}
        </Text>

        <TextButton
          contentContainerStyle={{
            width: 80,
            borderRadius: 30,
            backgroundColor: COLORS.primary
          }}
          label="See All"
          onPress={onPress}
        />
      </View>
      {children}
    </View>
  )
}

const HomeScreen = () => {
  const { userInfo } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [scholarPrograms, setScholarPrograms] = useState([]);

  useEffect(() => {
    getScholarProgram().then((res) => {
      setScholarPrograms(res);
      setLoading(false);
    })
  }, [])

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 40,
          marginBottom: 10,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flex: 1
          }}
        >
          <Text
            style={{
              // ...FONTS.h2 
            }}>
            Hello, {userInfo.username}
          </Text>
          <Text style={{
            color: COLORS.gray50,
            // ...FONTS.body3
          }}>
            Thursday, 10th October 2024
          </Text>
        </View>

        <IconButton
          icon={icons.notification}
          iconStyle={{
            tintColor: COLORS.black
          }}
        />

      </View>
    )
  }

  function renderStartLearning() {
    return (
      <ImageBackground
        source={images.featured_bg_image}
        style={{
          alignItems: 'flex-start',
          marginTop: SIZES.padding,
          marginHorizontal: SIZES.padding,
          padding: 15
        }}
        imageStyle={{
          borderRadius: SIZES.radius
        }}
      >
        <View>
          <Text
            style={{
              color: COLORS.white,
              // ...FONTS.body2
            }}
          >
            HOW TO
          </Text>
          <Text
            style={{
              color: COLORS.white,
              // ...FONTS.h2
            }}
          >
            Finding a scholarship for you
          </Text>
          <Text
            style={{
              marginTop: SIZES.radius,
              color: COLORS.white,
              // ...FONTS.body4
            }}
          >
            By ScholarFinder
          </Text>
        </View>

        <Image
          source={images.start_learning}
          style={{
            width: "100%",
            height: 110,
            marginTop: SIZES.padding
          }}
        />

        <TextButton
          label="Start Learning"
          contentContainerStyle={{
            height: 40,
            paddingHorizontal: SIZES.padding,
            borderRadius: 20,
            backgroundColor: COLORS.white
          }}
          labelStyle={{
            color: COLORS.black
          }}
        />
      </ImageBackground>
    )
  }

  function renderCourses() {
    return (
      <FlatList
        horizontal
        data={dummyData.courses_list_1}
        listKey="Courses"
        keyExtractor={item => `Courses-${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: SIZES.padding
        }}
        renderItem={({ item, index }) => (
          <VerticalCourseCard
            containerStyle={{
              marginLeft: index == 0 ? SIZES.padding : SIZES.radius,
              marginRight: index == dummyData.courses_list_1 - 1 ? SIZES.padding : 0
            }}
            course={item}
          />
        )}
      />
    )
  }

  function renderCategories() {
    return (
      <Section
        title="Categories"
      >
        <FlatList
          horizontal
          data={dummyData.categories}
          listKey="Categories"
          keyExtractor={item => `Categories-${item.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: SIZES.radius
          }}
          renderItem={({ item, index }) => (
            <CategoryCard
              sharedElementPrefix="Home"
              category={item}
              containerStyle={{
                marginLeft: index == 0 ? SIZES.padding : SIZES.base,
                marginRight: index == dummyData.categories.length - 1 ? SIZES.padding : 0
              }}
              onPress={() => navigation.navigate("ScholarshipListing", { category: item, sharedElementPrefix: "Home" })}
            />
          )}
        />
      </Section>
    )
  }

  function renderPopularCourses() {
    return (
      <Section
        title="Popular Scholarship"
        containerStyle={{
          marginTop: 30
        }}
      >
        <FlatList
          // data={dummyData.courses_list_2}
          data={scholarPrograms.data}
          listKey="Popular Courses"
          scrollEnabled={false}
          keyExtractor={item => `Popular Courses-${item.id}`}
          contentContainerStyle={{
            marginTop: SIZES.radius,
            paddingHorizontal: SIZES.padding
          }}
          renderItem={({ item, index }) => (
            <HorizontalList
              course={item}
              containerStyle={{
                marginVertical: SIZES.padding,
                marginTop: index == 0 ? SIZES.radius : SIZES.padding
              }}
            />
          )}
          ItemSeparatorComponent={() => (
            <LineDivider
              lineStyle={{
                backgroundColor: COLORS.gray20
              }}
            />
          )}
        />
      </Section>
    )
  }

  return (
    <GestureHandlerRootView>
      <View
        style={{
          // flex: 1,
          backgroundColor: COLORS.white,
        }}
      >
        {renderHeader()}
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 150
          }}
          showsVerticalScrollIndicator={false}
        >
          {renderStartLearning()}
          {renderCourses()}

          <LineDivider
            lineStyle={{
              marginVertical: SIZES.padding
            }}
          />

          {renderCategories()}
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={{ marginTop: SIZES.radius, ...FONTS.h3 }}>Loading...</Text>
            </View>
          ) : (
            renderPopularCourses()
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  )
}

export default HomeScreen