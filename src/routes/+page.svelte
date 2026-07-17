<script lang="ts">
  import Panel from "$lib/components/Panel.svelte";
  import HowWeKnowButton from "$lib/components/HowWeKnowButton.svelte";
  import { Menu, X, Mic, ExternalLink, LoaderCircle } from "@lucide/svelte";
  import Instagram from "$lib/components/icons/Instagram.svelte";
  import Linkedin from "$lib/components/icons/Linkedin.svelte";
  import Youtube from "$lib/components/icons/Youtube.svelte";
  import Facebook from "$lib/components/icons/Facebook.svelte";
  import BrandX from "$lib/components/icons/BrandX.svelte";
  import BrandTiktok from "$lib/components/icons/BrandTiktok.svelte";

  import helpArrow from "$lib/assets/icons/helpButtonArrow.svg";
  import lifePreserver from "$lib/assets/icons/lifePreserver.svg";
  import logo from "$lib/assets/logos/heartsAndMind/hearts-minds-logo.svg";

  import encampment from "$lib/assets/panelTwo/encampment.svg";
  import basePeople from "$lib/assets/panelTwo/basePeople.svg";
  import newPeopleOne from "$lib/assets/panelTwo/newPeople1.svg";
  import newPeopleTwo from "$lib/assets/panelTwo/newPeople2.svg";
  import newPeopleThree from "$lib/assets/panelTwo/newPeople3.svg";
  import newPeopleFour from "$lib/assets/panelTwo/newPeople4.svg";
  import newPeopleFive from "$lib/assets/panelTwo/newPeople5.svg";

  import rightArrow from "$lib/assets/icons/rightArrow.svg";
  import scribblesOne from "$lib/assets/panelThree/scribblesOne.svg";
  import scribblesTwo from "$lib/assets/panelThree/scribblesTwo.svg";
  import scribblesThree from "$lib/assets/panelThree/scribblesThree.svg";
  import scribblesFour from "$lib/assets/panelThree/scribblesFour.svg";
  import scribblesFive from "$lib/assets/panelThree/scribblesFive.svg";
  import scribblesSix from "$lib/assets/panelThree/scribblesSix.svg";
  import scribblesSeven from "$lib/assets/panelThree/scribblesSeven.svg";
  import scribblesEight from "$lib/assets/panelThree/scribblesEight.svg";
  import fullScribbles from "$lib/assets/panelThree/fullScribbles.png";

  import mythsArrow from "$lib/assets/icons/mythsArrow.svg";

  import mythOneShatterLeft from "$lib/assets/panelFour/shatter1_left.svg";
  import mythOneShatterRight from "$lib/assets/panelFour/shatter1_right.svg";
  import mythTwoShatterLeft from "$lib/assets/panelFour/shatter2_left.svg";
  import mythTwoShatterRight from "$lib/assets/panelFour/shatter2_right.svg";
  import mythThreeShatterLeft from "$lib/assets/panelFour/shatter3_left.svg";
  import mythThreeShatterRight from "$lib/assets/panelFour/shatter3_right.svg";

  import yp2fLogo from "$lib/assets/logos/orgs/stickerified/yp2f_logo.svg";
  import spyLogo from "$lib/assets/logos/orgs/stickerified/spy_logo.svg";
  import mfpLogo from "$lib/assets/logos/orgs/stickerified/mfp_logo.svg";
  import covenantLogo from "$lib/assets/logos/orgs/stickerified/YMH_covenant-house_sticker.png";
  import illuminationLogo from "$lib/assets/logos/orgs/stickerified/YMH_illumination-foundation_sticker.png";
  import insideSafeLogo from "$lib/assets/logos/orgs/stickerified/YMH_inside-safe_sticker.png";
  import invisiblePeopleLogo from "$lib/assets/logos/orgs/stickerified/YMH_invisible-people_sticker.png";
  import laYouthCountLogo from "$lib/assets/logos/orgs/stickerified/YMH_la-youth-count_sticker.png";
  import lahsaLogo from "$lib/assets/logos/orgs/stickerified/YMH_LAHSA_sticker.png";
  import midnightMissionLogo from "$lib/assets/logos/orgs/stickerified/YMH_midnight-mission_sticker.png";
  import pathLogo from "$lib/assets/logos/orgs/stickerified/YMH_PATH_sticker.png";
  import nineEightEightLogo from "$lib/assets/logos/orgs/988.png";
  import twoOneOneLALogo from "$lib/assets/logos/orgs/stickerified/211LA.png";

  import house from "$lib/assets/icons/house.svg";
  import present from "$lib/assets/icons/present.svg";
  import heart from "$lib/assets/icons/heart.svg";

  import { bgColor, COLOR_KEY } from "$lib/stores/colors";
  import { activeFrame } from "$lib/stores/activeFrame";
  import { get } from "svelte/store";
  import { fade, fly } from "svelte/transition";

  import { tweened } from "svelte/motion";
  import { expoOut, quintIn, quintOut } from "svelte/easing";
  import { derived } from "svelte/store";
  import ContentWidth from "$lib/components/ContentWidth.svelte";

  import { slide } from "svelte/transition";
  import { onMount } from "svelte";

  let isEmailSent = $state(false);
  let isEmailSending = $state(false);
  let isEmailFailed = $state(false);

  // Honeypot: a real user never fills this; a filled value is screened as a bot
  // by the central ingest endpoint.
  let botField = $state("");

  // Suggestion form fields (bound below).
  let suggestionName = $state("");
  let suggestionEmail = $state("");
  let suggestionSubject = $state("");
  let suggestionMessage = $state("");

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (isEmailSending) return; // re-entry guard
    isEmailSending = true;
    isEmailSent = false;
    isEmailFailed = false;

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          formType: "contact",
          name: suggestionName,
          email: suggestionEmail,
          subject: suggestionSubject,
          message: suggestionMessage,
          "bot-field": botField,
          sourceUrl: window.location.href,
        }),
      });

      const result = await response.json();

      if (response.ok && result?.ok) {
        isEmailSent = true;
      } else {
        isEmailFailed = true;
        console.error("Submission failed:", result);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      isEmailFailed = true;
    } finally {
      isEmailSending = false;
    }
  }

  const labels = ["Is this thing on?", "It could be why don't you check"];

  const orgs = [
    {
      name: "Young People to the Front",
      logo: yp2fLogo,
      siteUrl: "https://www.yp2f.org/",
      instagram: "https://www.instagram.com/youngpeopletothefront/",
      linkedin: "https://www.linkedin.com/company/yp2f",
      podcast: "https://podcasts.apple.com/us/podcast/young-people-to-the-front/id1686036117",
      bodyCopy:
        "YP2F is a reimagined think tank, one that combines advocacy with outcomes. We are a research and policy lab that cultivates a platform for the amplification of youth voices and in turn, strengthens the system and ultimately gets us closer to making youth homelessness as rare and brief as possible",
    },
    {
      name: "Safe Place for Youth",
      logo: spyLogo,
      siteUrl: "https://www.safeplaceforyouth.org/",
      instagram: "https://www.instagram.com/safeplaceforyouth/",
      facebook: "https://www.facebook.com/SafePlaceForYouth/",
      twitter: "https://twitter.com/safeplace4youth",
      youtube: "https://www.youtube.com/channel/UCUy5AnugYb4OhLuooZEByDA",
      bodyCopy:
        "S.P.Y. prioritizes low barriers for entry, harm-reduction, a trauma-informed approach, and the provision of a safe, supportive environment. We do this through a continuum of care that includes street outreach, access center services, case management, health and wellness, and education and employment programs.",
    },
    {
      name: "My Friend's Place",
      logo: mfpLogo,
      siteUrl: "https://www.myfriendsplace.org/",
      instagram: "http://instagram.com/myfriendsplace",
      facebook: "https://www.facebook.com/mfphollywood/",
      twitter: "https://twitter.com/MFPLA",
      youtube: "https://www.youtube.com/channel/UCwP9v838Jx58xYUjZoqehIg",
      bodyCopy:
        "They offer a comprehensive continuum of services to 1,000 youth experiencing homelessness between the ages of 12 and 25, and their children, each year, helping our young people who are experiencing homelessness to move toward wellness, stability and self-sufficiency.",
    },

    {
      name: "Illumination Foundation",
      logo: illuminationLogo,
      siteUrl: "https://www.ifhomeless.org/",
      instagram: "https://www.instagram.com/ifhomeless",
      facebook: "https://www.facebook.com/ifhomeless/",
      youtube: "https://www.youtube.com/channel/UCaYOwnK9WQ13b5LF5Lc1xBA",
      linkedin: "http://linkedin.com/company/illumination-foundation",
      bodyCopy:
        "Every person has an intrinsic right to home, health, and dignity. Our mission is to disrupt the cycle of homelessness in Southern California by providing a comprehensive safety net of client-centered services for the most vulnerable individuals, families, and children.",
    },
    {
      name: "Covenant House",
      logo: covenantLogo,
      siteUrl: "https://www.covenanthouse.org/homeless-issues/youth-homelessness-statistics",
      instagram: "https://www.instagram.com/covenant_house/",
      facebook: "https://www.facebook.com/CovenantHouse",
      twitter: "https://twitter.com/pathpartners",
      linkedin: "https://www.linkedin.com/company/covenant-house/",
      bodyCopy:
        "Covenant House is the largest, primarily privately funded charity in North and Central America providing immediate and long-term support for young people facing homelessness and survivors of trafficking.",
    },
    {
      name: "PATH",
      logo: pathLogo,
      siteUrl: "https://epath.org/",
      instagram: "https://instagram.com/pathpartners",
      facebook: "https://facebook.com/path.la",
      twitter: "https://twitter.com/pathpartners",
      youtube: "https://www.youtube.com/user/pathpartners",
      bodyCopy:
        "Across the state, we help people find permanent housing and provide case management, medical and mental healthcare, benefits advocacy, employment training, and other services to help them maintain their homes stably.",
    },
    {
      name: "Midnight Mission",
      logo: midnightMissionLogo,
      siteUrl: "https://www.midnightmission.org/",
      facebook: "https://www.facebook.com/TheMidnightMission",
      instagram: "https://www.instagram.com/themidnightmission/",
      linkedin: "https://www.linkedin.com/company/1710372/",
      youtube: "https://www.youtube.com/tmmvolunteer",
      twitter: "https://twitter.com/midnightmission",
      tiktok: "https://tiktok.com/@themidnightmission",
      bodyCopy:
        "We remove obstacles and provide the accountability and structure that people who are experiencing homelessness need to be productive in their communities. Our conviction and commitment to their success define us.",
    },

    {
      name: "LA Youth Count",
      logo: laYouthCountLogo,
      siteUrl: "https://youthcount.org/",
      bodyCopy:
        "The Youth Count is a point-in-time estimate of the unsheltered youth population in the county, required by HUD. It helps with funding, understanding, and advocacy. While it focuses on unsheltered youth, it acknowledges that many young people, such as couch surfers and those in non-voucher hotels/motels, may not be counted.",
    },
  ];

  const groups = [
    {
      name: "Affordable Housing, Homelessness Solutions & Prevention Now",
      logo: "",
      siteUrl: "https://file.lacounty.gov/SDSInter/bos/supdocs/186696.pdf",
      bodyCopy:
        "The purpose of this citizens initiative is to use goals-based accountability to fund L.A. County’s comprehensive homelessness response system as well as invest in new strategies to address street encampments, prevent homelessness and create affordable housing.",
    },
    {
      name: "Inside Safe",
      logo: insideSafeLogo,
      siteUrl: "https://mayor.lacity.gov/InsideSafe",
      instagram: "https://www.instagram.com/mayorofla/",
      facebook: "https://www.facebook.com/mayorofla",
      twitter: "https://twitter.com/mayorofla",
      youtube: "https://www.youtube.com/channel/UC2rvX04kIK5BqcLUDVXJThg",
      bodyCopy:
        "A bold city-wide, voluntary, proactive housing-led strategy to bring people inside from tents and encampments, and to prevent encampments from returning. It is one feature in a comprehensive strategy to confront the homelessness crisis that in the first year of the Bass administration, brought more than 21,000 Angelenos inside.",
    },
    {
      name: "Los Angeles Homeless Services Authority",
      logo: lahsaLogo,
      siteUrl: "https://www.lahsa.org/",
      facebook: "https://www.facebook.com/lahsa.org/",
      instagram: "https://www.instagram.com/lahomelessservices/",
      youtube: "https://www.youtube.com/user/LAHSAIT",
      twitter: "https://twitter.com/LAHomeless",
      bodyCopy:
        "LAHSA is the lead agency in the Los Angeles Continuum of Care, which is the regional planning body that coordinates housing and services for homeless families and individuals in Los Angeles County. LAHSA coordinates and manages over $800 million annually in federal, state, county, and city funds for programs that provide shelter, housing, and services to people experiencing homelessness.",
    },
    {
      name: "988",
      logo: nineEightEightLogo,
      siteUrl: "https://www.988california.org/",
      bodyCopy:
        "The National Suicide Prevention Lifeline provides confidential emotional support to people in suicidal crisis or emotional distress 24 hours a day, 7 days a week, across the United States.",
    },
    {
      name: "211LA",
      logo: twoOneOneLALogo,
      siteUrl: "https://211la.org/",
      bodyCopy:
        "211 LA (or 211 LA County) is the hub for community members and community organizations looking for all types of health, human, and social services in Los Angeles County.",
      instagram: "https://www.instagram.com/211lacounty/",
      linkedin: "https://www.linkedin.com/company/211-la/about/",
      facebook: "https://www.facebook.com/211lacounty",
      twitter: "https://twitter.com/211LACounty",
    },
    {
      name: "Invisible People",
      logo: invisiblePeopleLogo,
      siteUrl: "https://invisiblepeople.tv/",
      facebook: "https://www.facebook.com/invisiblepeopletv",
      instagram: "https://instagram.com/invisiblepeople",
      youtube: "https://www.youtube.com/user/invisiblepeopletv",
      twitter: "https://twitter.com/invisiblepeople",
      tiktok: "https://www.tiktok.com/@invisiblepeopletv",
      bodyCopy:
        "Each year, our groundbreaking educational content reaches more than a billion people across the globe. Our real and unfiltered stories of homelessness shatter stereotypes, demand attention and deliver a call-to-action that is being answered by governments, major brands, nonprofit organizations, and everyday citizens just like you.",
    },
  ];

  let activeAccordians: boolean[] = $state([]);

  labels.forEach(() => activeAccordians.push(false));

  let isMobileNavActive = $state(false);

  let isHelpModalActive = $state(false);

  let isSuggestionModalActive = $state(false);

  let toThirtyEight = tweened(0 as number, {
    duration: 2000,
    easing: quintOut,
  });
  let toThirtyEightFormatted = derived(toThirtyEight, ($toThirtyEight) => $toThirtyEight.toFixed());

  let toSixtyNine = tweened(0 as number, { duration: 2000, easing: quintOut });
  let toSixtyNineFormatted = derived(toSixtyNine, ($toSixtyNine) => $toSixtyNine.toFixed());

  //frame one
  let showSittingPerson = $state(true);
  let showSleepingPerson = $state(false);
  let isLampOn = $state(false);
  let isFrameOneStarted = $state(false);
  let lightCone: SVGElement | undefined = $state();
  let bottomOfLightCone = $state(0);
  const FRAME_SPEED = 0.75;
  const runFrameOne = async () => {
    if (!isFrameOneStarted) {
      isFrameOneStarted = true;
      setTimeout(() => bgColor.set("masthead-tan"), 1500 * FRAME_SPEED);

      setTimeout(() => {
        bgColor.set("masthead-blue");
      }, 3000 * FRAME_SPEED);

      setTimeout(() => {
        showSittingPerson = false;
        showSleepingPerson = true;
      }, 4500 * FRAME_SPEED);

      setTimeout(() => {
        isLampOn = true;
      }, 7500 * FRAME_SPEED);
    }
  };

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isLampOn;
    if (lightCone) bottomOfLightCone = lightCone.getBoundingClientRect().bottom;
  });

  // frame two

  $effect(() => {
    if ($activeFrame === 2) {
      setTimeout(() => toThirtyEight.set(38), 500);

      //for frame 3
    } else if ($activeFrame === 3) {
      setTimeout(() => toSixtyNine.set(69), 500);
      bgColor.set("mental-health-purple");
    } else {
      setTimeout(() => {
        toThirtyEight.set(0);
        toSixtyNine.set(0);
        isFrameThreeStarted = false;
        isFrameThreeFinished = false;
      }, 1000);
    }
  });

  const setToFrameTwo = () => {
    activeFrame.set(2);
  };

  // frame three
  let isFrameThreeStarted = $state(false);
  let isFrameThreeFinished = $state(false);

  const runFrameThree = () => {
    isFrameThreeStarted = true;
    setTimeout(() => {
      isFrameThreeFinished = true;
    }, 3000);
  };

  const setToFrameThree = () => {
    bgColor.set("mental-health-purple");

    activeFrame.set(3);
  };

  //frame four
  let isMythOne = $state(false);
  let isMythOneBusted = $state(false);
  let isMythTwo = $state(false);
  let isMythTwoBusted = $state(false);
  let isMythThree = $state(false);
  let isMythThreeBusted = $state(false);

  const setToFrameFour = () => {
    isMythOne = false;
    isMythOneBusted = false;
    isMythTwo = false;
    isMythTwoBusted = false;
    isMythThree = false;
    isMythThreeBusted = false;
    bgColor.set("darkest-red");

    activeFrame.set(4);
  };

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    activeFrame;

    if (get(activeFrame) === 4) bgColor.set("darkest-red");

    if (isMythOneBusted) bgColor.set("dark-red");

    if (isMythTwoBusted) bgColor.set("red");
  });

  const crackOpenEase = (t: number) => {
    if (t < 0.1) return quintOut(t / 0.1) * 0.1;

    return 0.1 + quintIn((t - 0.1) / 0.9) * 0.9;
  };

  ///frame 5

  let frameFiveBench: SVGSVGElement | undefined = $state();
  let frameFiveBenchOffsetLeft = $state(0);
  let isFrameFiveStarted = $state(false);
  let showArm = $state(false);

  const setFrameFive = () => {
    isFrameFiveStarted = false;
    showArm = false;
    bgColor.set("night");
    activeFrame.set(5);
    isFrameFiveStarted = false;

    setTimeout(() => {
      if (frameFiveBench) frameFiveBenchOffsetLeft = frameFiveBench.getBoundingClientRect().left;
      runFrameFive();
    }, 5);
  };

  const runFrameFive = async () => {
    if (!isFrameFiveStarted) {
      bgColor.set("day");

      isFrameFiveStarted = true;

      setTimeout(() => (showArm = true), 2000 * FRAME_SPEED);
    }
  };

  //frame 6

  let activeFeature = $state(0);

  const setToFrameSix = () => {
    activeFeature = 0;
    activeFrame.set(6);
    sources = document.getElementById("sources");
    document.getElementById("help")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAccordianClick = (i: number) => {
    if (activeAccordians[i]) {
      activeAccordians[i] = false;
    } else {
      activeAccordians.fill(false);
      activeAccordians[i] = true;
    }
  };

  const setToSources = () => {
    activeFrame.set(6);

    sources = document.getElementById("sources");

    document.getElementById("sources")?.scrollIntoView({ behavior: "smooth" });
  };

  let isSourcesInView = $state(false);
  let sources: HTMLElement | null;

  const handleScroll = () => {
    if (get(activeFrame) === 6 && sources) {
      isSourcesInView = sources?.getBoundingClientRect().top < 10;
    }
    console.log("scrolled");
  };

  const goToNextFrame = () => activeFrame.update((frame) => frame + 1);

  const resetToFrameOne = () => {
    showSittingPerson = true;
    showSleepingPerson = false;
    isLampOn = false;
    isFrameOneStarted = false;
    bgColor.set("masthead-pink");

    isFrameThreeStarted = false;
    isFrameThreeFinished = false;

    isMythOne = false;
    isMythOneBusted = false;
    isMythTwo = false;
    isMythTwoBusted = false;
    isMythThree = false;
    isMythThreeBusted = false;

    toThirtyEight.set(0);
    toSixtyNine.set(0);

    setTimeout(() => activeFrame.update(() => 1), 200);
    setTimeout(() => runFrameOne(), 1000);
  };

  onMount(() => {
    runFrameOne();
    window.addEventListener("resize", () => {
      if (isLampOn) {
        isLampOn = false;
        setTimeout(() => (isLampOn = true), 800);
      }

      if (get(activeFrame) === 5) {
        if (frameFiveBench) frameFiveBenchOffsetLeft = frameFiveBench.getBoundingClientRect().left;
      }
    });

    if (get(activeFrame) === 6) sources = document.getElementById("sources");

    Array.from(document.getElementsByClassName("panel")).forEach((e) =>
      e.addEventListener("scroll", handleScroll),
    );
  });
</script>

<svelte:head>
  <title>Hearts and Minds</title>
</svelte:head>

<main class="w-screen h-screen fixed">
  <div
    class="h-12 lg:h-16 w-screen flex flex-row items-center justify-between py-3 px-8 absolute z-40"
  >
    <button class="h-full hidden lg:block" onclick={setToFrameSix}>
      <span class="flex flex-row items-center bump">
        <div class="w-40 btn-text text-light-pink hover:text-pink transition-colors">
          I WANT TO HELP
        </div>
        <img class="h-6" src={helpArrow} alt="down arrow" />
      </span>
    </button>
    <button class="h-full bump hover:opacity-90" onclick={resetToFrameOne}>
      <img class="h-full" src={logo} alt="hearts & minds" />
    </button>
    <button class="h-full hidden lg:block" onclick={() => (isHelpModalActive = true)}>
      <span class="flex flex-row items-center transition bump">
        <div class="w-40 btn-text text-light-pink hover:text-pink transition-colors">
          SOS, I NEED HELP
        </div>
        <img class="h-6" src={lifePreserver} alt="life preserver" />
      </span>
    </button>
    <button
      class="lg:hidden text-light-pink hover:text-pink bump"
      onclick={() => (isMobileNavActive = true)}
    >
      <Menu size={24} />
    </button>
  </div>
  {#if isMobileNavActive}
    <div
      class="w-screen h-screen bg-masthead-pink fixed z-50 top-0 left-0 flex flex-col items-center justify-center gap-20"
      transition:fly={{ y: "-100%" }}
    >
      <button
        class=""
        onclick={() => {
          setToFrameSix();
          isMobileNavActive = false;
        }}
      >
        <span class="flex flex-row items-center bump">
          <div class="w-40 btn-text text-light-pink hover:text-pink transition-colors">
            I WANT TO HELP
          </div>
          <img class="h-6" src={helpArrow} alt="down arrow" />
        </span>
      </button>
      <button
        class=""
        onclick={() => {
          isHelpModalActive = true;
          isMobileNavActive = false;
        }}
      >
        <span class="flex flex-row items-center transition bump">
          <div class="w-40 btn-text text-light-pink hover:text-pink transition-colors">
            SOS, I NEED HELP
          </div>
          <img class="h-6" src={lifePreserver} alt="life preserver" />
        </span>
      </button>
      <button
        class="bump text-light-pink hover:text-pink flex flex-row gap-3 hover:gap-4"
        onclick={() => {
          isSuggestionModalActive = true;
          isMobileNavActive = false;
        }}
      >
        <div class="btn-text">I have a suggestion</div>
        <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            id="Vector"
            d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
            fill={COLOR_KEY["pink"]}
          />
        </svg>
      </button>
      <button
        class="absolute top-4 right-8 text-pink hover:text-light-pink bump"
        onclick={() => (isMobileNavActive = false)}
        aria-label="Close"
      >
        <X size={24} />
      </button>
    </div>
  {/if}
  {#if isSuggestionModalActive}
    <div
      class="w-screen overflow-y-auto overflow-x-hidden h-screen bg-help-light fixed z-50 top-0 left-0"
      transition:fly={{ x: "-100%" }}
    >
      <div class="flex flex-col items-center justify-center gap-20 p-12 pb-24">
        {#if !isEmailSent}
          {#if isEmailFailed}
            <button
              class="z-10 absolute flex flex-col items-center justify-center top-2 border-pink border-4 rounded-sm bg-help-dark"
              onclick={() => (isEmailFailed = false)}
              transition:fade
            >
              <h2 class="h-as-h5 text-night p-8">
                Something went wrong. Please fill all fields and retry.
              </h2>
            </button>
          {/if}
          <form
            class="w-full flex flex-col gap-8 max-w-[600px]"
            name="contact"
            id="contact"
            method="POST"
            onsubmit={handleSubmit}
          >
            <h2 class="h-as-h5 text-light-orange">SEND US A MESSAGE</h2>
            <!-- Honeypot: hidden from real users; a filled value is screened as a bot. -->
            <input
              type="text"
              name="bot-field"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
              class="hidden"
              bind:value={botField}
            />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              class="p-3 rounded-sm"
              bind:value={suggestionName}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              class="p-3 rounded-sm"
              bind:value={suggestionEmail}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              class="p-3 rounded-sm"
              bind:value={suggestionSubject}
            />

            <textarea
              name="message"
              class="w-full h-48 p-3 rounded-sm"
              placeholder="Your Message"
              bind:value={suggestionMessage}></textarea>

            <button type="submit" class="flex flex-row gap-3" id="submitButton">
              {#if !isEmailSending}
                <div class="btn-text text-orange">Send Message</div>
                <svg
                  class="w-16 text-orange"
                  viewBox="0 0 150 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    id="Vector"
                    d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                    fill="currentColor"
                  />
                </svg>
              {:else}
                <div>
                  <LoaderCircle size={32} class="text-orange animate-spin leading-4" />
                </div>
              {/if}
            </button>
          </form>
        {/if}
        {#if isEmailSent}
          <div class="w-full h-72 flex flex-col items-start justify-start gap-16 p-16 md:p-32">
            <h2 class="h-as-h5 text-orange">THANK YOU!</h2>
            <p>We appreciate your feedback. We'll get back to you as soon as we can.</p>
            <button onclick={() => (isSuggestionModalActive = false)} class="flex flex-row gap-3">
              <div class="btn-text text-orange">Go Back to site</div>
              <svg
                class="w-16 text-orange"
                viewBox="0 0 150 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="Vector"
                  d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        {/if}
      </div>

      <button
        class="absolute top-4 right-8 text-pink hover:text-light-pink bump"
        onclick={() => (isSuggestionModalActive = false)}
        aria-label="Close"
      >
        <X size={24} />
      </button>
    </div>
  {/if}
  {#if isHelpModalActive}
    <div
      class="w-screen h-screen bg-masthead-pink fixed z-50 top-0 left-0 overflow-y-auto overflow-x-hidden"
      transition:fly={{ x: "100%" }}
    >
      <div class="flex flex-col items-center justify-center gap-12 p-12 py-24">
        <h3 class="h-as-h5 text-[#A82D7D] max-w-[540px] text-center">
          If you are experiencing a mental health crisis and need help now, call 988.
        </h3>
        <p class="text-center max-w-[540px]">
          The National Suicide Prevention Lifeline provides confidential emotional support to people
          in suicidal crisis or emotional distress 24 hours a day, 7 days a week, across the United
          States.
        </p>
        <div class="flex flex-col md:flex-row justify-center items-center gap-10 pb-24">
          <a
            target="_blank"
            href="tel:988"
            class="flex flex-row items-center justify-center transition bump gap-3"
          >
            <div class="btn-text text-light-pink hover:text-pink transition-colors">CALL 988</div>
            <img class="h-6" src={lifePreserver} alt="life preserver" />
          </a>

          <a
            target="_blank"
            href="https://988lifeline.org/chat/"
            class="bump text-light-pink hover:text-pink flex flex-row gap-3"
          >
            <div class="btn-text">text or chat 988</div>
            <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                id="Vector"
                d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                fill="#A82D7D"
              />
            </svg>
          </a>
        </div>
        <h3 class="h-as-h5 text-[#A82D7D] max-w-[540px] text-center mt-6">
          If you are in search of support in the form of health, human and social services, call
          211.
        </h3>
        <p class="text-center max-w-[540px]">
          211 LA (or 211 LA County) is the hub for community members and community organizations
          looking for all types of health, human, and social services in Los Angeles County.
        </p>
        <div class="flex flex-col md:flex-row justify-center items-center gap-10 pb-24">
          <a
            target="_blank"
            href="tel:211"
            class="flex flex-row items-center justify-center transition bump gap-3"
          >
            <div class="btn-text text-light-pink hover:text-pink transition-colors">CALL 211</div>
            <img class="h-6" src={lifePreserver} alt="life preserver" />
          </a>

          <a
            target="_blank"
            href="https://211la.org/"
            class="bump text-light-pink hover:text-pink flex flex-row gap-3"
          >
            <div class="btn-text">Go to 211LA.org</div>
            <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                id="Vector"
                d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                fill="#A82D7D"
              />
            </svg>
          </a>
        </div>
      </div>
      <button
        class="absolute top-4 right-8 text-pink hover:text-light-pink bump"
        onclick={() => (isHelpModalActive = false)}
        aria-label="Close"
      >
        <X size={24} />
      </button>
    </div>
  {/if}
  <div class="w-2 gap-4 flex flex-col absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-40">
    <button
      class="w-2 h-2 rounded-full bg-pink opacity-75 hover:bg-opacity-100 cursor-pointer transition {$activeFrame ===
      1
        ? 'bg-opacity-100'
        : 'bg-opacity-55'}"
      onclick={resetToFrameOne}
      aria-label="Go to slide 1"
    ></button>
    <button
      class="w-2 h-2 rounded-full bg-pink opacity-75 hover:bg-opacity-100 cursor-pointer transition {$activeFrame ===
      2
        ? 'bg-opacity-100'
        : 'bg-opacity-55'}"
      onclick={setToFrameTwo}
      aria-label="Go to slide 2"
    ></button>
    <button
      class="w-2 h-2 rounded-full bg-pink opacity-75 hover:bg-opacity-100 cursor-pointer transition {$activeFrame ===
      3
        ? 'bg-opacity-100'
        : 'bg-opacity-55'}"
      onclick={setToFrameThree}
      aria-label="Go to slide 3"
    ></button>
    <button
      class="w-2 h-2 rounded-full bg-pink opacity-75 hover:bg-opacity-100 cursor-pointer transition {$activeFrame ===
      4
        ? 'bg-opacity-100'
        : 'bg-opacity-55'}"
      onclick={setToFrameFour}
      aria-label="Go to slide 4"
    ></button>
    <button
      class="w-2 h-2 rounded-full bg-pink opacity-75 hover:bg-opacity-100 cursor-pointer transition {$activeFrame ===
      5
        ? 'bg-opacity-100'
        : 'bg-opacity-55'}"
      onclick={setFrameFive}
      aria-label="Go to slide 5"
    ></button>
    <button
      class="w-2 h-2 rounded-full bg-pink opacity-75 hover:bg-opacity-100 cursor-pointer transition {$activeFrame ===
        6 && !isSourcesInView
        ? 'bg-opacity-100'
        : 'bg-opacity-55'}"
      onclick={setToFrameSix}
      aria-label="Go to slide 6"
    ></button>
    <button
      class="w-2 h-2 rounded-full bg-pink opacity-75 hover:bg-opacity-100 cursor-pointer transition {$activeFrame ===
        6 && isSourcesInView
        ? 'bg-opacity-100'
        : 'bg-opacity-55'}"
      onclick={setToSources}
      aria-label="Go to slide 7"
    ></button>
  </div>
  <Panel frame={1}>
    <div
      class="w-full h-full relative {isFrameOneStarted
        ? 'cursor-default'
        : ''} transition-colors ease-linear"
      style="background-color:{COLOR_KEY[$bgColor]}; transition-duration:{1000 * FRAME_SPEED}ms"
    >
      <!--bench-->
      <svg
        class="absolute bottom-16 -left-32 sm:-left-20 lg:left-auto right-auto lg:right-32 xl:right-64 md:scale-100 sm:scale-75 scale-[50%] transition-opacity ease-linear xl:scale-110 xl:-translate-x-[5%] xl:-translate-y-[5%] {$bgColor ===
        'masthead-blue'
          ? 'opacity-10'
          : 'opacity-35'}"
        style="transition-duration:{2000 * FRAME_SPEED}ms;"
        width="719"
        height="319"
        viewBox="0 0 719 319"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_5151_6604)">
          <path d="M0 163.93L718.68 150.39V225.42L0 213.45V163.93Z" />
          <path
            d="M606.83 0.620209L598.93 98.2102L581.8 97.8402L578.67 128.87L366.86 132.84L362.83 98.4202L334.24 97.8402L330.64 133.69L113.92 137.62L109.26 98.4202L82.31 97.8902L75.37 13.2402L606.83 0.620209Z"
          />
          <path d="M115.26 230.09L186.99 235.35L173.07 319.01H125.48L115.26 230.1V230.09Z" />
          <path d="M570.17 319L526.43 318.13L516.88 237.26H586.32L570.17 319Z" />
        </g>
        <defs>
          <clipPath id="clip0_5151_6604">
            <rect width="718.68" height="318.38" fill="white" transform="translate(0 0.620209)" />
          </clipPath>
        </defs>
      </svg>

      <!--sitting person-->

      {#if showSittingPerson}
        <svg
          out:fade={{ easing: (t) => t, duration: 2000 * FRAME_SPEED }}
          class="absolute bottom-12 md:bottom-16 left-[200px] sm:left-[400px] md:left-[480px] right-auto lg:left-auto lg:right-20 xl:right-52 md:scale-100 sm:scale-75 scale-[50%] xl:scale-110 xl:-translate-x-[5%] xl:-translate-y-[5%]"
          width="227"
          height="410"
          fill={COLOR_KEY[$bgColor] || "white"}
          viewBox="0 0 227 410"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_5151_6609)">
            <path
              fill={COLOR_KEY[$bgColor] || "white"}
              class=" transition-colors ease-linear"
              d="M67.85 62.2901L5.6 141.34L0 238.45L15.56 251.44L123.37 265.52L127.33 282.91L85.12 368.63L85.9 397.83L120.76 409.66L226.42 280.27L210.56 235.97L123.37 201.64L153.75 128.87L67.85 62.2901Z"
              style="transition-duration:{1000 * FRAME_SPEED}ms; filter:brightness(0.9);"
            />
            <path
              fill={COLOR_KEY[$bgColor] || "white"}
              class="transition-colors ease-linear"
              d="M119.39 94.8501L92.78 62.2901L123.37 9.15527e-05H176.09L197.35 25.9601V62.2901L160.36 94.8501H119.39Z"
              style="transition-duration:{1000 * FRAME_SPEED}ms;  filter:brightness(0.9);"
            />
            <path
              fill="black"
              class=" transition-colors ease-linear opacity-10"
              d="M67.85 62.2901L5.6 141.34L0 238.45L15.56 251.44L123.37 265.52L127.33 282.91L85.12 368.63L85.9 397.83L120.76 409.66L226.42 280.27L210.56 235.97L123.37 201.64L153.75 128.87L67.85 62.2901Z"
            />
            <path
              fill="black"
              class="transition-colors ease-linear opacity-10"
              d="M119.39 94.8501L92.78 62.2901L123.37 9.15527e-05H176.09L197.35 25.9601V62.2901L160.36 94.8501H119.39Z"
            />
          </g>
          <defs>
            <clipPath id="clip0_5151_6609">
              <rect width="226.42" height="409.66" fill={COLOR_KEY[$bgColor] || "white"} />
            </clipPath>
          </defs>
        </svg>
      {/if}

      <!--sleeping person-->
      {#if showSleepingPerson}
        <svg
          in:fade={{
            delay: 400 * FRAME_SPEED,
            easing: (t) => t,
            duration: 2000 * FRAME_SPEED,
          }}
          class="absolute bottom-40 lg:bottom-48 right-auto -left-12 sm:left-8 lg:left-auto lg:right-[620px] md:scale-100 sm:scale-75 scale-[50%] xl:scale-110 xl:-translate-x-[5%] xl:-translate-y-[5%]"
          width="431"
          height="177"
          viewBox="0 0 431 177"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_5017_5407)">
            <path
              d="M103.269 114.64L107.369 72.7999L47.3795 37.8999L3.49945 67.1299L0.189453 100.51L20.3295 130.75L69.1595 137.35L103.269 114.64Z"
              fill="#19294B"
            />
            <path
              d="M95.9492 45.59L167.169 0L245.899 8.49L325.699 20.47L323.979 81.25L285.529 121.44L180.369 144.66L107.369 134.13L126.549 75.45L95.9492 45.59Z"
              fill="#19294B"
            />
            <path
              d="M283.43 98.2302L272.68 166L298.74 176.93L391.88 141.92L430.85 119.46L417.9 62.4402L361.25 67.2802L325.7 20.4702L283.43 98.2302Z"
              fill="#19294B"
            />
          </g>
          <defs>
            <clipPath id="clip0_5017_5407">
              <rect width="430.66" height="176.93" fill="white" transform="translate(0.189453)" />
            </clipPath>
          </defs>
        </svg>
      {/if}

      <!--light cone-->
      {#if isLampOn && $activeFrame === 1}
        <svg
          bind:this={lightCone}
          in:fade={{
            delay: 400 * FRAME_SPEED,
            easing: (t) => t,
            duration: 600 * FRAME_SPEED,
          }}
          class="absolute top-[110px] sm:top-[260px] md:top-[320px] lg:top-auto lg:bottom-0 -left-[406px] sm:-left-[290px] md:-left-[240px] lg:left-[2px] scale-[50%] sm:scale-100 xl:scale-110 xl:translate-x-[5%] xl:-translate-y-[5%] mix-blend-overlay"
          width="1155"
          height="683"
          viewBox="0 0 1155 683"
          fill="#C6D8EF"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M438.05 0.114746L315.785 3.29375L-338.319 638.423L13.3617 743.44H778.313L1154.13 650.435L438.05 0.114746Z"
          />
        </svg>
        <div
          in:fade={{
            delay: 400 * FRAME_SPEED,
            easing: (t) => t,
            duration: 600 * FRAME_SPEED,
          }}
          class="bg-[#C6D8EF] opacity-40 mix-blend-overlay absolute h-1/2 w-screen"
          style="top:{bottomOfLightCone}px;"
        ></div>
      {/if}

      <!--lamp-->
      <svg
        class="absolute overflow-visible -top-32 md:-top-16 lg:top-auto lg:bottom-16 -left-48 md:-left-40 lg:left-16 sm:scale-75 scale-[50%] lg:scale-100 xl:scale-110 xl:translate-x-[5%] xl:-translate-y-[5%] transition-opacity ease-linear {$bgColor ===
        'masthead-blue'
          ? 'opacity-10'
          : 'opacity-35'}"
        width="400"
        height="864"
        viewBox="0 0 400 864"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        style="transition-duration:{2000 * FRAME_SPEED}ms;"
      >
        <g class="lg:-translate-y-[144px]">
          <path
            d="M323.382 428.602C352.477 427.849 376.723 406.978 382.542 379.115L261.637 382.235C268.964 409.775 294.18 429.355 323.275 428.602H323.382Z"
            fill={$bgColor}
          />
          <path
            d="M56.8971 492.72L125.647 480.886L141.164 883.453L47.9531 882.485L56.8971 492.72Z"
            fill={$bgColor}
          />
          <path
            d="M134.483 430.108L48.8152 427.849L47.9531 472.602L133.621 464.103L134.483 430.108Z"
            fill={$bgColor}
          />
          <path
            d="M113.146 135.229C113.146 84.7736 154.203 43.7854 204.741 43.7854C255.28 43.7854 296.336 85.5267 296.336 135.229C296.336 155.777 285.56 181.919 285.56 181.919L340.086 175.572V135.229C340.086 60.6756 279.31 0 204.634 0C129.957 0 69.3965 60.6756 69.3965 135.229V416.875H125.646L113.146 135.229Z"
            fill={$bgColor}
          />
          <path
            d="M373.061 187.621L257.975 198.272L231.035 362.332L400.108 367.819L373.169 187.621H373.061Z"
            fill={$bgColor}
          />
          <path d="M20.7974 894.749H160.776L185.022 1009H0L20.7974 894.749Z" fill={$bgColor} />
        </g>
      </svg>
      <!--bulb-->
      {#if isLampOn}
        <svg
          in:fade={{
            delay: 400 * FRAME_SPEED,
            easing: (t) => t,
            duration: 600 * FRAME_SPEED,
          }}
          class="absolute -top-32 md:-top-16 lg:top-auto lg:bottom-16 -left-48 md:-left-40 lg:left-16 sm:scale-75 scale-[50%] lg:scale-100 xl:scale-110 xl:translate-x-[5%] xl:-translate-y-[5%]"
          width="400"
          height="864"
          viewBox="0 0 400 864"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          style="transition-duration:{2000 * FRAME_SPEED}ms;"
        >
          <g class="lg:-translate-y-[144px]">
            <path
              d="M323.382 428.602C352.477 427.849 376.723 406.978 382.542 379.115L261.637 382.235C268.964 409.775 294.18 429.355 323.275 428.602H323.382Z"
              fill="white"
            />
          </g>
        </svg>
      {/if}
    </div>
    <div
      class="w-screen h-screen absolute top-0 left-0 flex justify-center items-center pointer-events-none"
    >
      <h2
        class=" text-[#1B41A0] w-4/5 max-w-[1040px] text-center -translate-y-1/2 md:translate-y-0"
      >
        Raising awareness for LA’s unhoused youth and their mental health.
      </h2>
      {#if isLampOn}
        <button
          transition:fade
          onclick={goToNextFrame}
          class="negative-bump absolute bottom-32 md:bottom-20 text-light-pink hover:text-pink transition-colors pointer-events-auto bob-always"
        >
          <span class="flex flex-col justify-center items-center gap-4">
            <svg
              class="transition-colors"
              width="26"
              height="58"
              viewBox="0 0 26 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Frame 226">
                <path
                  id="Vector"
                  d="M7.42627 52.3481C8.32294 53.4848 9.24153 54.6446 10.2427 55.69C10.4417 55.8994 10.6651 56.1136 10.9055 56.3037C10.9513 56.3519 11.0076 56.3901 11.0598 56.4242C11.6157 56.8246 12.2563 57.1046 12.9538 56.9999C14.0556 56.8298 14.7432 55.7581 15.3206 54.9146C16.1296 53.7275 16.9044 52.5212 17.6572 51.2958C19.2013 48.7767 20.6184 46.1868 21.9042 43.5264C22.2364 42.8441 22.5248 41.5579 21.8285 40.976C21.1322 40.3941 20.3249 41.2727 20.0423 41.8561C18.998 44.0119 17.877 46.1292 16.6575 48.1845C16.0894 49.1427 15.499 50.0902 14.8846 51.0207C14.623 51.4207 14.3554 51.8184 14.0898 52.2142C13.9093 52.4773 13.731 52.7385 13.5464 53.0055C13.4651 53.3059 13.3267 53.3657 13.1294 53.1665C13.0826 53.1592 13.0358 53.1519 12.9769 53.136C12.1983 36.5194 13.8455 19.8262 17.9448 3.70897C18.115 3.04913 18.2727 1.75545 17.3947 1.48572C16.5695 1.2296 15.8555 2.37823 15.6921 3.01167C11.7586 18.4818 9.92463 34.4158 10.3013 50.3624C9.76788 49.7254 9.24093 49.0743 8.73471 48.4115C7.25756 46.4793 5.90533 44.4562 4.66088 42.3745C3.6319 40.6581 1.76864 43.9906 2.52501 45.2607C4.02921 47.7332 5.6527 50.0963 7.42633 52.349L7.42627 52.3481Z"
                  fill="currentColor"
                />
              </g>
            </svg>

            <div class="btn-text transition-colors">LET'S GET STARTED</div>
          </span>
        </button>
      {/if}
    </div>
  </Panel>

  <Panel frame={2}>
    <div
      class="w-screen h-screen bg-underpass-blue flex flex-col justify-center items-center gap-9"
    >
      <svg
        class="absolute top-0 left-0 h-[40vh] max-h-72"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 199 424"
        fill="none"
      >
        <path
          d="M0.879883 369.18L198.03 423.1V257.41C162 159.1 110.37 68.5901 46.0699 -11.1899H0.879883V369.18Z"
          fill="#2E4C8E"
        />
      </svg>
      <svg
        class="absolute top-0 right-0"
        xmlns="http://www.w3.org/2000/svg"
        width="353"
        height="764"
        viewBox="0 0 353 764"
        fill="none"
      >
        <path
          d="M268.631 420.37L271.621 763.9L352.481 746.66V-11.1899H0.680664C116.391 112.2 208.061 258.41 268.631 420.37Z"
          fill="#2E4C8E"
        />
      </svg>

      <svg
        class="absolute bottom-0 right-0 lg:w-screen min-h-[80vh]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1441 580"
        fill="none"
      >
        <path
          d="M1.50051 0.340088L1440.48 420.79V624L0.520508 80.4501L1.50051 0.340088Z"
          fill="#1C4182"
        />
      </svg>

      <img
        class="top-[75vh] sm:top-[60vh] lg:top-[40vh] xl:top-[30vh] left-[12vw] w-[80vw] absolute"
        src={encampment}
        alt="encampment"
      />
      <img
        class="top-[60vh] lg:top-[40vh] xl:top-[30vh] left-[10vw] w-[80vw] absolute"
        src={basePeople}
        alt="people"
      />
      {#if $activeFrame === 2}
        <img
          class="top-[75vh] sm:top-[60vh] lg:top-[40vh] xl:top-[35vh] left-[19vw] w-[80vw] absolute"
          src={newPeopleOne}
          alt="people"
          transition:fade={{ duration: 1000, delay: 500 }}
        />
        <img
          class="top-[75vh] sm:top-[60vh] lg:top-[40vh] xl:top-[35vh] left-[19vw] w-[80vw] absolute"
          src={newPeopleTwo}
          alt="people"
          transition:fade={{ duration: 1000, delay: 1500 }}
        />
        <img
          class="top-[75vh] sm:top-[60vh] lg:top-[40vh] xl:top-[35vh] left-[19vw] w-[80vw] absolute"
          src={newPeopleThree}
          alt="people"
          transition:fade={{ duration: 1000, delay: 2500 }}
        />
        <img
          class="top-[75vh] sm:top-[60vh] lg:top-[40vh] xl:top-[35vh] left-[19vw] w-[80vw] absolute"
          src={newPeopleFour}
          alt="people"
          transition:fade={{ duration: 1000, delay: 3500 }}
        />
        <img
          class="top-[75vh] sm:top-[60vh] lg:top-[40vh] xl:top-[35vh] left-[19vw] w-[80vw] absolute"
          src={newPeopleFive}
          alt="people"
          transition:fade={{ duration: 1000, delay: 4500 }}
        />
        <button
          transition:fade={{ delay: 2500 }}
          onclick={goToNextFrame}
          aria-label="Next"
          class="bob-always negative-bump absolute right-8 sm:right-auto bottom-32 md:bottom-20 text-light-pink hover:text-pink transition-colors pointer-events-auto"
        >
          <span class="flex flex-col justify-center items-center gap-4">
            <svg
              class="transition-colors"
              width="26"
              height="58"
              viewBox="0 0 26 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Frame 226">
                <path
                  id="Vector"
                  d="M7.42627 52.3481C8.32294 53.4848 9.24153 54.6446 10.2427 55.69C10.4417 55.8994 10.6651 56.1136 10.9055 56.3037C10.9513 56.3519 11.0076 56.3901 11.0598 56.4242C11.6157 56.8246 12.2563 57.1046 12.9538 56.9999C14.0556 56.8298 14.7432 55.7581 15.3206 54.9146C16.1296 53.7275 16.9044 52.5212 17.6572 51.2958C19.2013 48.7767 20.6184 46.1868 21.9042 43.5264C22.2364 42.8441 22.5248 41.5579 21.8285 40.976C21.1322 40.3941 20.3249 41.2727 20.0423 41.8561C18.998 44.0119 17.877 46.1292 16.6575 48.1845C16.0894 49.1427 15.499 50.0902 14.8846 51.0207C14.623 51.4207 14.3554 51.8184 14.0898 52.2142C13.9093 52.4773 13.731 52.7385 13.5464 53.0055C13.4651 53.3059 13.3267 53.3657 13.1294 53.1665C13.0826 53.1592 13.0358 53.1519 12.9769 53.136C12.1983 36.5194 13.8455 19.8262 17.9448 3.70897C18.115 3.04913 18.2727 1.75545 17.3947 1.48572C16.5695 1.2296 15.8555 2.37823 15.6921 3.01167C11.7586 18.4818 9.92463 34.4158 10.3013 50.3624C9.76788 49.7254 9.24093 49.0743 8.73471 48.4115C7.25756 46.4793 5.90533 44.4562 4.66088 42.3745C3.6319 40.6581 1.76864 43.9906 2.52501 45.2607C4.02921 47.7332 5.6527 50.0963 7.42633 52.349L7.42627 52.3481Z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </span>
        </button>
      {/if}

      <h2 class="h-as-h6 z-10 text-pink">DID YOU KNOW</h2>
      <h3 class="z-10 text-light-pink max-w-screen-lg text-center w-4/5">
        Homelessness in youth and young adults has increased
      </h3>
      <h4 class="h-as-h1 z-10 text-[#EAD4DF] -translate-y-[30px]">
        {$toThirtyEightFormatted}%
      </h4>
      <HowWeKnowButton
        text="According to LAHSA’s 2023 Greater Los Angeles Homeless Youth Count, there were over 2,000 youth and young adults experiencing homeless in 2023 on any given night."
        reportLink="https://www.lahsa.org/documents?id=7689-yc2023-la-coc-data-summary"
        class="z-20"
      />
    </div>
  </Panel>

  <Panel
    frame={3}
    class="flex flex-col items-center justify-start md:justify-center text-center will-change-transform"
  >
    <img
      class="absolute w-screen h-screen object-cover"
      src={scribblesOne}
      alt="background-scribbles"
      transition:fade
    />
    {#if isFrameThreeStarted && !isFrameThreeFinished}
      <img
        class="absolute w-screen h-screen object-cover"
        src={scribblesTwo}
        alt="background-scribbles"
        in:fade={{ delay: 400 }}
        out:fade
      />
      <img
        class="absolute w-screen h-screen object-cover"
        src={scribblesThree}
        alt="background-scribbles"
        in:fade={{ delay: 800 }}
        out:fade
      />
      <img
        class="absolute w-screen h-screen object-cover"
        src={scribblesFour}
        alt="background-scribbles"
        in:fade={{ delay: 1200 }}
        out:fade
      />
      <img
        class="absolute w-screen h-screen object-cover"
        src={scribblesFive}
        alt="background-scribbles"
        in:fade={{ delay: 1600 }}
        out:fade
      />
      <img
        class="absolute w-screen h-screen object-cover"
        src={scribblesSix}
        alt="background-scribbles"
        in:fade={{ delay: 2000 }}
        out:fade
      />
      <img
        class="absolute w-screen h-screen object-cover"
        src={scribblesSeven}
        alt="background-scribbles"
        in:fade={{ delay: 2400 }}
        out:fade
      />
      <img
        class="absolute w-screen h-screen object-cover"
        src={scribblesEight}
        alt="background-scribbles"
        in:fade={{ delay: 2800 }}
        out:fade
      />
    {/if}
    {#if isFrameThreeFinished}
      <img
        class="absolute w-screen h-screen object-cover"
        src={fullScribbles}
        alt="background-scribbles"
        transition:fade={{ duration: 600 }}
      />
    {/if}
    <h2 class="h-as-h6 z-10 text-pink mt-32 md:mt-0">WHAT'S ON THE LINE</h2>

    <div class="z-10 h-[40vh]">
      {#if !isFrameThreeStarted}
        <div out:fly={{ x: "-100%", duration: 400 }}>
          <h3 class="h-as-h1 z-10 text-[#EAD4DF]">{$toSixtyNineFormatted}%</h3>
          <h4 class="h-as-h3 z-10 text-light-pink max-w-[992px] w-4/5 text-center mx-auto">
            Of homeless youth experience mental illness or crises while unhoused
          </h4>
          <button class="z-10 mt-12 sm:mt-24 bump hover:brightness-125" onclick={runFrameThree}>
            <img src={rightArrow} alt="next arrow" />
          </button>
        </div>
      {:else}
        <h3
          in:fly={{ delay: 400, duration: 400, x: "100%" }}
          class="z-10 text-light-pink max-w-[992px] w-4/5 text-center mx-auto mt-16"
        >
          Without adequate care, young people are at greater <span class="text-[#EAD4DF]"
            >risk of suicide attempts and suicide.</span
          >
        </h3>
      {/if}
    </div>
    {#if isFrameThreeStarted}
      <button
        transition:fade={{ delay: 2500 }}
        onclick={() => {
          goToNextFrame();
          bgColor.set("darkest-red");
        }}
        aria-label="Next"
        class="bob-always negative-bump absolute bottom-32 md:bottom-20 mx-auto text-light-pink hover:text-pink transition-colors pointer-events-auto right-8 sm:right-auto"
      >
        <span class="flex flex-col justify-center items-center gap-4">
          <svg
            class="transition-colors"
            width="26"
            height="58"
            viewBox="0 0 26 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Frame 226">
              <path
                id="Vector"
                d="M7.42627 52.3481C8.32294 53.4848 9.24153 54.6446 10.2427 55.69C10.4417 55.8994 10.6651 56.1136 10.9055 56.3037C10.9513 56.3519 11.0076 56.3901 11.0598 56.4242C11.6157 56.8246 12.2563 57.1046 12.9538 56.9999C14.0556 56.8298 14.7432 55.7581 15.3206 54.9146C16.1296 53.7275 16.9044 52.5212 17.6572 51.2958C19.2013 48.7767 20.6184 46.1868 21.9042 43.5264C22.2364 42.8441 22.5248 41.5579 21.8285 40.976C21.1322 40.3941 20.3249 41.2727 20.0423 41.8561C18.998 44.0119 17.877 46.1292 16.6575 48.1845C16.0894 49.1427 15.499 50.0902 14.8846 51.0207C14.623 51.4207 14.3554 51.8184 14.0898 52.2142C13.9093 52.4773 13.731 52.7385 13.5464 53.0055C13.4651 53.3059 13.3267 53.3657 13.1294 53.1665C13.0826 53.1592 13.0358 53.1519 12.9769 53.136C12.1983 36.5194 13.8455 19.8262 17.9448 3.70897C18.115 3.04913 18.2727 1.75545 17.3947 1.48572C16.5695 1.2296 15.8555 2.37823 15.6921 3.01167C11.7586 18.4818 9.92463 34.4158 10.3013 50.3624C9.76788 49.7254 9.24093 49.0743 8.73471 48.4115C7.25756 46.4793 5.90533 44.4562 4.66088 42.3745C3.6319 40.6581 1.76864 43.9906 2.52501 45.2607C4.02921 47.7332 5.6527 50.0963 7.42633 52.349L7.42627 52.3481Z"
                fill="currentColor"
              />
            </g>
          </svg>
        </span>
      </button>
      <HowWeKnowButton
        text="Chapin University conducted a national survey of in 2017 and found that 69% of homeless youth report mental health challenges that can lead to significant and long term health issues."
        reportLink="https://www.chapinhall.org/research/one-in-10-young-adults-experience-homelessness-during-one-year/"
        color="purple"
      />
    {/if}
  </Panel>
  <Panel frame={4}>
    {#if !isMythOne && !isMythTwo && !isMythThree}
      <div class="bg-darkest-red w-screen h-screen absolute">
        <div
          class="w-full h-full flex flex-col items-center justify-center z-20"
          out:fly={{ x: "-100vw", duration: 400, opacity: 1 }}
        >
          <h2 class="h-as-h6 text-pink">LET'S GET THESE</h2>
          <h3 class="h-as-h1 text-[#EAD4DF]">MYTHS</h3>
          <h4 class="h-as-h3 text-light-pink max-w-screen-lg">OUT OF THE WAY</h4>
          <button class="hover:brightness-125 bump bob-always" onclick={() => (isMythOne = true)}>
            <img src={mythsArrow} alt="arrow right" />
          </button>
        </div>
      </div>
    {/if}
    {#if isMythOne}
      <div
        class="absolute h-screen w-screen top-0 left-0"
        out:fly={{ x: "-100vw", duration: 400 }}
        in:fly={{ x: "100vw", duration: 400, delay: 400, opacity: 1 }}
      >
        <div class="absolute w-full h-full flex flex-col items-center justify-center">
          <h3 class="z-10 text-[#EAD4DF] max-w-screen-lg w-4/5 text-center mx-auto">
            <span class="text-light-pink">FALSE</span><br />SHELTERS ARE NOTORIOUSLY UNDERFUNDED AND
            UNDERSTAFFED, CREATING UNSAFE CONDITIONS
          </h3>
          <button
            class="z-10 mt-8 md:mt-24 bump hover:brightness-125 w-full bob-always"
            onclick={() => {
              isMythTwo = true;
              isMythOne = false;
            }}
          >
            <span class="flex flex-row justify-center items-center gap-6">
              <img src={rightArrow} alt="next arrow" />
            </span>
          </button>
          <HowWeKnowButton
            color="red"
            reportLink="https://www.aclusocal.org/sites/default/files/aclu_socal_oc_shelters_report.pdf"
            text="Most unhoused people would move to shelter if there were safe and affordable options. In a report by the ACLU, they found that residents in emergency centers in Orange County were met with untrained, abusive, and neglectful shelter staff."
          />
        </div>
        {#if !isMythOneBusted}
          <img
            src={mythOneShatterLeft}
            alt="shattering background"
            class="z-20 absolute h-screen w-screen top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 object-cover"
            out:fly={{
              delay: 200,
              duration: 1800,
              x: "-100%",
              opacity: 1,
              easing: crackOpenEase,
            }}
          />
          <img
            src={mythOneShatterRight}
            alt="shattering background"
            class="z-20 absolute h-screen w-screen top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 object-cover"
            out:fly={{
              delay: 200,
              duration: 1800,
              x: "100%",
              opacity: 1,
              easing: crackOpenEase,
            }}
          />
          <button
            class="absolute w-full h-full z-20"
            onclick={() => (isMythOneBusted = true)}
            transition:fade
          >
            <span class="flex flex-col items-center justify-center">
              <h2 class="h-as-h6 text-pink">01/03</h2>
              <h3 class=" text-[#EAD4DF] max-w-[992px] w-4/5 text-center mx-auto">
                <span class="text-light-pink">"BUT I THOUGHT</span><br />There are enough people
                helping"
              </h3>
              <span class="mt-8 md:mt-24 bump hover:brightness-125 w-full">
                <span class="flex flex-row gap-6 hover:gap-7 justify-center items-center">
                  <div class="text-pink btn-text">BREAK THE STIGMA</div>
                  <img src={rightArrow} alt="next arrow" class="w-20" />
                </span>
              </span>
            </span>
          </button>
        {/if}
      </div>
    {/if}
    {#if isMythTwo}
      <div
        class="absolute h-screen w-screen top-0 left-0"
        out:fly={{ x: "-100vw", duration: 400, opacity: 1 }}
        in:fly={{ x: "100vw", duration: 400, delay: 400, opacity: 1 }}
      >
        <div class="absolute w-full h-full flex flex-col items-center justify-center bg-red">
          <h3 class=" text-[#EAD4DF] max-w-screen-lg text-center w-4/5 mx-auto">
            <span class="text-light-pink">FALSE</span><br />homeless folks would move inside if
            housing programs met their needs.
          </h3>
          <button
            class="mt-8 md:mt-24 bump hover:brightness-125 w-full bob-always"
            onclick={() => {
              isMythThree = true;
              isMythTwo = false;
            }}
          >
            <span class="flex flex-row gap-6 justify-center items-center">
              <img src={rightArrow} alt="next arrow" />
            </span>
          </button>
          <HowWeKnowButton
            color="red"
            reportLink="https://nlihc.org/sites/default/files/Housing-First-Research.pdf"
            text="Homelessness is not a choice. Most individuals are seeking shelter, employment, and support but find it difficult to adhere to “treatment-first” programs. Instead, “housing-first” programs offer flexibility to a larger population and can help them find employment and maintain stable housing"
          />
        </div>
        {#if !isMythTwoBusted}
          <img
            src={mythTwoShatterLeft}
            alt="shattering background"
            class="z-20 absolute h-screen w-screen top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 object-cover"
            out:fly={{
              delay: 200,
              duration: 1800,
              x: "-100%",
              y: "-100%",
              opacity: 1,
              easing: crackOpenEase,
            }}
          />
          <img
            src={mythTwoShatterRight}
            alt="shattering background"
            class="z-20 absolute h-screen w-screen top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 object-cover"
            out:fly={{
              delay: 200,
              duration: 1800,
              x: "100%",
              y: "100%",
              opacity: 1,
              easing: crackOpenEase,
            }}
          />

          <button
            class="absolute w-full h-full z-20"
            onclick={() => (isMythTwoBusted = true)}
            transition:fade
          >
            <span class="flex flex-col items-center justify-center">
              <h2 class="h-as-h6 text-pink">02/03</h2>
              <h3 class=" text-[#EAD4DF] max-w-[992px] w-4/5 text-center mx-auto">
                <span class="text-light-pink">"BUT I THOUGHT</span><br />They don't want anyone's
                help"
              </h3>
              <span class="mt-8 md:mt-24 bump hover:brightness-125 w-full">
                <span class=" flex flex-row gap-6 hover:gap-7 justify-center items-center">
                  <div class="text-pink btn-text">BREAK THE STIGMA</div>
                  <img
                    src={rightArrow}
                    alt="next arrow"
                    class="w-20
                    "
                  />
                </span>
              </span>
            </span>
          </button>
        {/if}
      </div>
    {/if}
    {#if isMythThree}
      <div
        class="absolute h-screen w-screen top-0 left-0"
        out:fly={{ x: "-100%", duration: 400, opacity: 1 }}
        in:fly={{ x: "100%", duration: 400, delay: 400, opacity: 1 }}
      >
        <div class=" absolute w-full h-full flex flex-col items-center justify-center bg-light-red">
          <h3 class=" text-[#EAD4DF] max-w-screen-lg text-center w-4/5 mx-auto">
            <span class="text-light-pink">FALSE</span><br />many are employed or seeking employment,
            but lack the resources for safe housing
          </h3>
          <button
            class="  absolute bottom-32 md:bottom-20 mt-8 md:mt-24 bump hover:brightness-125 right-8 sm:right-auto bob-always"
            onclick={setFrameFive}
            aria-label="Next"
          >
            <span class="flex flex-row gap-6 hover:gap-7 justify-center items-center">
              <svg
                class="transition-colors text-light-pink"
                width="26"
                height="58"
                viewBox="0 0 26 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Frame 226">
                  <path
                    id="Vector"
                    d="M7.42627 52.3481C8.32294 53.4848 9.24153 54.6446 10.2427 55.69C10.4417 55.8994 10.6651 56.1136 10.9055 56.3037C10.9513 56.3519 11.0076 56.3901 11.0598 56.4242C11.6157 56.8246 12.2563 57.1046 12.9538 56.9999C14.0556 56.8298 14.7432 55.7581 15.3206 54.9146C16.1296 53.7275 16.9044 52.5212 17.6572 51.2958C19.2013 48.7767 20.6184 46.1868 21.9042 43.5264C22.2364 42.8441 22.5248 41.5579 21.8285 40.976C21.1322 40.3941 20.3249 41.2727 20.0423 41.8561C18.998 44.0119 17.877 46.1292 16.6575 48.1845C16.0894 49.1427 15.499 50.0902 14.8846 51.0207C14.623 51.4207 14.3554 51.8184 14.0898 52.2142C13.9093 52.4773 13.731 52.7385 13.5464 53.0055C13.4651 53.3059 13.3267 53.3657 13.1294 53.1665C13.0826 53.1592 13.0358 53.1519 12.9769 53.136C12.1983 36.5194 13.8455 19.8262 17.9448 3.70897C18.115 3.04913 18.2727 1.75545 17.3947 1.48572C16.5695 1.2296 15.8555 2.37823 15.6921 3.01167C11.7586 18.4818 9.92463 34.4158 10.3013 50.3624C9.76788 49.7254 9.24093 49.0743 8.73471 48.4115C7.25756 46.4793 5.90533 44.4562 4.66088 42.3745C3.6319 40.6581 1.76864 43.9906 2.52501 45.2607C4.02921 47.7332 5.6527 50.0963 7.42633 52.349L7.42627 52.3481Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </span>
          </button>
          <HowWeKnowButton
            color="red"
            reportLink="https://bfi.uchicago.edu/wp-content/uploads/2021/06/BFI_WP_2021-65.pdf"
            text="Many people experiencing homelessness are employed or actively seeking employment and would move inside if housing responsive to their needs were available. "
          />
        </div>
        {#if !isMythThreeBusted}
          <img
            src={mythThreeShatterLeft}
            alt="shattering background"
            class="z-20 absolute h-screen w-screen top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 object-cover"
            out:fly={{
              delay: 200,
              duration: 1800,
              x: "-100%",
              y: "100%",
              opacity: 1,
              easing: crackOpenEase,
            }}
          />
          <img
            src={mythThreeShatterRight}
            alt="shattering background"
            class="z-20 absolute h-screen w-screen top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 object-cover"
            out:fly={{
              delay: 200,
              duration: 1800,
              x: "100%",
              y: "-100%",
              opacity: 1,
              easing: crackOpenEase,
            }}
          />

          <button
            class=" absolute w-full h-full z-20"
            onclick={() => (isMythThreeBusted = true)}
            transition:fade
          >
            <span class=" flex-col items-center justify-center">
              <h2 class="h-as-h6 text-pink">03/03</h2>
              <h3 class=" text-[#EAD4DF] max-w-[992px] w-4/5 text-center mx-auto">
                <span class="text-light-pink">"BUT I THOUGHT</span><br />They are just lazy and
                unambitious"
              </h3>
              <span class=" mt-24 bump hover:brightness-125 w-full">
                <span class=" flex flex-row gap-6 hover:gap-7 justify-center items-center">
                  <div class="text-pink btn-text">BREAK THE STIGMA</div>
                  <img
                    src={rightArrow}
                    alt="next arrow"
                    class="w-20
                    "
                  />
                </span>
              </span>
            </span>
          </button>
        {/if}
      </div>
    {/if}
  </Panel>

  <Panel frame={5}>
    <div
      class="w-full h-full absolute top-0 left-0 overflow-hidden flex flex-col items-center justify-start pt-28 sm:pt-32 transition-colors duration-[6000ms] delay-1000 ease-out"
    >
      {#if $activeFrame === 5}
        <!--bench-->

        <svg
          bind:this={frameFiveBench}
          class="absolute bottom-16 -right-[400px] sm:-right-[25vw] lg:-right-96 xl:right-0 md:scale-100 sm:scale-75 scale-[50%] transition-opacity ease-linear xl:scale-110 xl:-translate-x-[5%] xl:-translate-y-[5%] opacity-35"
          style="transition-duration:{2000 * FRAME_SPEED}ms;"
          width="719"
          height="319"
          viewBox="0 0 719 319"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_5151_6604)">
            <path d="M0 163.93L718.68 150.39V225.42L0 213.45V163.93Z" />
            <path
              d="M606.83 0.620209L598.93 98.2102L581.8 97.8402L578.67 128.87L366.86 132.84L362.83 98.4202L334.24 97.8402L330.64 133.69L113.92 137.62L109.26 98.4202L82.31 97.8902L75.37 13.2402L606.83 0.620209Z"
            />
            <path d="M115.26 230.09L186.99 235.35L173.07 319.01H125.48L115.26 230.1V230.09Z" />
            <path d="M570.17 319L526.43 318.13L516.88 237.26H586.32L570.17 319Z" />
          </g>
          <defs>
            <clipPath id="clip0_5151_6604">
              <rect width="718.68" height="318.38" fill="white" transform="translate(0 0.620209)" />
            </clipPath>
          </defs>
        </svg>

        <!--lamp-->
        <svg
          class="absolute overflow-visible -top-32 md:-top-16 lg:top-auto lg:bottom-16 -left-48 md:-left-40 lg:left-16 sm:scale-75 scale-[50%] lg:scale-100 xl:scale-110 xl:translate-x-[5%] xl:-translate-y-[5%] transition-opacity ease-linear opacity-35"
          width="400"
          height="864"
          viewBox="0 0 400 864"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          style="transition-duration:{2000 * FRAME_SPEED}ms;"
        >
          <g class="lg:-translate-y-[144px]">
            <path
              d="M323.382 428.602C352.477 427.849 376.723 406.978 382.542 379.115L261.637 382.235C268.964 409.775 294.18 429.355 323.275 428.602H323.382Z"
              fill={$bgColor}
            />
            <path
              d="M56.8971 492.72L125.647 480.886L141.164 883.453L47.9531 882.485L56.8971 492.72Z"
              fill={$bgColor}
            />
            <path
              d="M134.483 430.108L48.8152 427.849L47.9531 472.602L133.621 464.103L134.483 430.108Z"
              fill={$bgColor}
            />
            <path
              d="M113.146 135.229C113.146 84.7736 154.203 43.7854 204.741 43.7854C255.28 43.7854 296.336 85.5267 296.336 135.229C296.336 155.777 285.56 181.919 285.56 181.919L340.086 175.572V135.229C340.086 60.6756 279.31 0 204.634 0C129.957 0 69.3965 60.6756 69.3965 135.229V416.875H125.646L113.146 135.229Z"
              fill={$bgColor}
            />
            <path
              d="M373.061 187.621L257.975 198.272L231.035 362.332L400.108 367.819L373.169 187.621H373.061Z"
              fill={$bgColor}
            />
            <path d="M20.7974 894.749H160.776L185.022 1009H0L20.7974 894.749Z" fill={$bgColor} />
          </g>
        </svg>

        <!--sitting person-->
        {#key frameFiveBenchOffsetLeft}
          <svg
            out:fade={{ easing: (t) => t, duration: 2000 * FRAME_SPEED }}
            style="left:{frameFiveBenchOffsetLeft}px"
            class="absolute bottom-12 md:bottom-16 md:scale-100 sm:scale-75 scale-[50%] xl:scale-110 -translate-x-24 xl:-translate-y-[5%]"
            width="227"
            height="410"
            fill={COLOR_KEY["day"]}
            viewBox="0 0 227 410"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_5372_1634)">
              <path
                class="ease-linear"
                d="M155.49 94L186.99 165L226.41 271.405L210.84 284.395L103.04 298.475L99.0702 315.875L141.28 401.585L140.51 430.785L105.65 442.615L-0.00976562 313.225L15.8402 268.935L103.04 234.595L78.4902 133L155.49 94Z"
                fill="#F0C480"
                style="transition-duration:{1000 * FRAME_SPEED}ms"
              />
              <path
                class="ease-linear"
                d="M76.3714 103.775H118.421L147.291 40.6754L113.921 -0.15457L80.3714 -0.18457L52.2414 22.8054L50.4414 72.0554L76.3714 103.775Z"
                fill="#F0C480"
                style="transition-duration:{1000 * FRAME_SPEED}ms"
              />
              {#if showArm}
                <g
                  in:fade={{ easing: (t) => t, duration: 4000 * FRAME_SPEED }}
                  clip-path="url(#clip1_5372_1634)"
                >
                  <path
                    d="M114.114 157.89C114.114 157.89 117.236 152.439 119.014 151.39C120.792 150.342 125.164 149.159 125.164 149.159L132.247 152.885C132.247 152.885 133.256 160.624 133.242 163.093C133.228 165.563 126.396 174.635 126.396 174.635L114.039 183.783C114.039 183.783 105.611 178.157 101.73 174.559C97.8492 170.961 94.9585 162.977 94.9585 162.977C94.9585 162.977 96.0074 155.745 97.4648 152.799C98.9221 149.853 103.116 149.096 103.116 149.096L109.252 151.364L114.111 157.9L114.114 157.89Z"
                    fill="#EC492F"
                  />
                </g>
              {/if}
            </g>
            <defs>
              <clipPath id="clip0_5372_1634">
                <rect width="226" height="443" fill="white" transform="translate(-0.00976562)" />
              </clipPath>
              <clipPath id="clip1_5372_1634">
                <rect
                  width="37.38"
                  height="36.36"
                  fill="white"
                  transform="translate(101.438 141) rotate(18.9782)"
                />
              </clipPath>
            </defs>
          </svg>

          <svg
            in:fade={{ easing: (t) => t, duration: 4000 * FRAME_SPEED }}
            style="left:{frameFiveBenchOffsetLeft}px"
            class="absolute bottom-12 md:bottom-16 md:scale-100 sm:scale-75 scale-[50%] xl:scale-110 -translate-x-72 sm:-translate-x-[440px] lg:-translate-x-[200%] xl:-translate-x-[175%] translate-y-7 md:translate-y-0 xl:-translate-y-[5%]"
            width="285"
            height="510"
            fill={COLOR_KEY[$bgColor] || "white"}
            viewBox="0 0 285 510"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_5372_1620)">
              <path
                d="M161.46 278.34V124.77H72.59L25.32 188.89V322.22H43.89V376.79L0 509.57H69.77L115.9 379.6V322.22H127.7V345.84L165.41 393.11V509.56H234.04V379.05L161.46 278.34Z"
                fill="#EFAD81"
              />
              <path
                d="M130.76 109.8L93.0898 91.12L95.2598 21.76L143.28 0L173.36 14.88L188.35 47.97L168.09 92.89L130.76 109.8Z"
                fill="#EFAD81"
              />
            </g>
            {#if showArm}
              <g in:fade={{ easing: expoOut, duration: 4000 * FRAME_SPEED }}>
                <path
                  d="M160.51 218.12L225.35 245.86H278.86L284.8 226.82L222.66 203.26L161.46 124.77L160.51 218.12Z"
                  fill="#EFAD81"
                />
              </g>
            {/if}
            {#if showArm}
              <g in:fade={{ easing: (t) => t, duration: 4000 * FRAME_SPEED }}>
                <path
                  d="M130.91 165.55C130.91 165.55 134.56 160.44 136.43 159.56C138.3 158.68 142.77 157.95 142.77 157.95L149.45 162.35C149.45 162.35 149.69 170.15 149.43 172.61C149.17 175.07 141.48 183.42 141.48 183.42L128.27 191.3C128.27 191.3 120.44 184.87 116.94 180.91C113.43 176.95 111.34 168.71 111.34 168.71C111.34 168.71 113.1 161.62 114.85 158.83C116.6 156.04 120.84 155.71 120.84 155.71L126.72 158.57L130.91 165.55Z"
                  fill="#EC492F"
                />
              </g>
            {/if}
            <defs>
              <clipPath id="clip0_5372_1620">
                <rect width="284.8" height="509.57" fill="white" />
              </clipPath>
            </defs>
          </svg>
        {/key}

        <h3
          class="{isFrameFiveStarted
            ? 'opacity-100 transition delay-[2000ms] duration-[5000ms]'
            : 'opacity-80'}  h-as-h5-metrics text-blue text-2xl sm:text-[28px][] text-center -translate-y-16 lg:translate-y-16 max-w-screen-xl w-5/6"
        >
          We want to shed light on the issue to
        </h3>
        <h2
          class="{isFrameFiveStarted
            ? 'text-orange opacity-100 transition duration-[4000ms] delay-[1800ms]'
            : 'text-light-pink opacity-0'}  w-5/6 -translate-y-16 lg:translate-y-16 uppercase ease-out text-center"
        >
          open hearts and minds
        </h2>

        {#if isFrameFiveStarted}
          <button
            transition:fade={{ delay: 4000 }}
            onclick={setToFrameSix}
            class="bob-always negative-bump absolute bottom-32 md:bottom-20 text-light-orange hover:text-orange transition-colors pointer-events-auto flex flex-col justify-center items-center gap-4"
          >
            <svg
              class="transition-colors"
              width="26"
              height="58"
              viewBox="0 0 26 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Frame 226">
                <path
                  id="Vector"
                  d="M7.42627 52.3481C8.32294 53.4848 9.24153 54.6446 10.2427 55.69C10.4417 55.8994 10.6651 56.1136 10.9055 56.3037C10.9513 56.3519 11.0076 56.3901 11.0598 56.4242C11.6157 56.8246 12.2563 57.1046 12.9538 56.9999C14.0556 56.8298 14.7432 55.7581 15.3206 54.9146C16.1296 53.7275 16.9044 52.5212 17.6572 51.2958C19.2013 48.7767 20.6184 46.1868 21.9042 43.5264C22.2364 42.8441 22.5248 41.5579 21.8285 40.976C21.1322 40.3941 20.3249 41.2727 20.0423 41.8561C18.998 44.0119 17.877 46.1292 16.6575 48.1845C16.0894 49.1427 15.499 50.0902 14.8846 51.0207C14.623 51.4207 14.3554 51.8184 14.0898 52.2142C13.9093 52.4773 13.731 52.7385 13.5464 53.0055C13.4651 53.3059 13.3267 53.3657 13.1294 53.1665C13.0826 53.1592 13.0358 53.1519 12.9769 53.136C12.1983 36.5194 13.8455 19.8262 17.9448 3.70897C18.115 3.04913 18.2727 1.75545 17.3947 1.48572C16.5695 1.2296 15.8555 2.37823 15.6921 3.01167C11.7586 18.4818 9.92463 34.4158 10.3013 50.3624C9.76788 49.7254 9.24093 49.0743 8.73471 48.4115C7.25756 46.4793 5.90533 44.4562 4.66088 42.3745C3.6319 40.6581 1.76864 43.9906 2.52501 45.2607C4.02921 47.7332 5.6527 50.0963 7.42633 52.349L7.42627 52.3481Z"
                  fill="currentColor"
                />
              </g>
            </svg>

            <div class="btn-text transition-colors">LET'S DO SOMETHING</div>
          </button>
        {/if}
      {/if}
    </div>
  </Panel>

  <Panel frame={6} class="overflow-y-scroll overflow-x-hidden">
    <div
      class="w-full min-h-screen flex flex-col items-center justify-center bg-help-light"
      id="help"
    >
      <div class="flex flex-col items-center justify-center max-w-screen-md my-32">
        <h2 class="h-as-h6 text-light-orange">make a difference</h2>
        <h2 class="h-as-h3 text-orange my-9">How to help</h2>
        <p class="text-center mx-[8%]">
          Here are organizations doing good in Los Angeles so you can learn more about the homeless
          crisis and become an advocate for our neighbors.
        </p>
      </div>

      <div
        class="bg-help-dark h-[1024px] lg:h-[480px] w-4/5 max-w-screen-lg mb-32 relative flex flex-row flex-nowrap overflow-hidden rounded"
      >
        <div
          class="p-10 relative flex flex-col lg:flex-row lg:gap-16 justify-start items-start lg:items-center w-full h-full flex-shrink-0 transition-transform duration-700 ease-in"
          style="transform: translateX(-{activeFeature * 100}%)"
        >
          <img class="w-64" src={yp2fLogo} alt="young people to the front logo" />
          <div>
            <h3 class="h-as-h5 text-orange mb-7">Young people to the front</h3>
            <p class="text-left">
              YP2F is a reimagined think tank, one that combines advocacy with outcomes. We are a
              research and policy lab that cultivates a platform for the amplification of youth
              voices and in turn, strengthens the system and ultimately gets us closer to making
              youth homelessness as rare and brief as possible
            </p>
            <a
              target="_blank"
              class="bump flex flex-row pt-5 gap-5 hover:gap-6 my-7 text-orange hover:brightness-125"
              href="https://www.yp2f.org/"
            >
              <div class="btn-text">GO TO SITE</div>
              <svg
                class="w-20 hover:brightness-125"
                viewBox="0 0 150 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="Vector"
                  d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <div class="flex flex-row gap-4 mt-7">
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.instagram.com/youngpeopletothefront/"
                aria-label="Instagram"><Instagram size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.linkedin.com/company/yp2f"
                aria-label="LinkedIn"><Linkedin size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://podcasts.apple.com/us/podcast/young-people-to-the-front/id1686036117"
                aria-label="Podcast"><Mic size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.yp2f.org/"
                aria-label="Website"><ExternalLink size={20} /></a
              >
            </div>

            <div class="flex-row gap-5 flex mt-7">
              <button
                onclick={() => activeFeature--}
                class="{activeFeature === 0
                  ? 'opacity-40 pointer-events-none'
                  : ''} carousel-nav text-light-orange hover:text-orange bump">&lt; back</button
              >
              <button
                onclick={() => activeFeature++}
                class="{activeFeature === 2
                  ? 'opacity-40 pointer-events-none'
                  : ''} carousel-nav text-light-orange hover:text-orange bump">next &gt;</button
              >
            </div>
          </div>
        </div>

        <div
          class="p-10 relative flex flex-col lg:flex-row gap-16 justify-start items-start lg:items-center w-full flex-shrink-0 transition-transform duration-700 ease-in"
          style="transform: translateX(-{activeFeature * 100}%)"
        >
          <img class="w-64" src={spyLogo} alt="young people to the front logo" />
          <div>
            <h3 class="h-as-h5 text-orange mb-7">Safe place for youth</h3>
            <p class="text-left">
              S.P.Y. prioritizes low barriers for entry, harm-reduction, a trauma-informed approach,
              and the provision of a safe, supportive environment. We do this through a continuum of
              care that includes street outreach, access center services, case management, health
              and wellness, and education and employment programs.
            </p>
            <a
              target="_blank"
              class="bump flex flex-row pt-5 gap-5 hover:gap-6 my-7 text-orange hover:brightness-125"
              href="https://www.safeplaceforyouth.org/"
            >
              <div class="btn-text">GO TO SITE</div>
              <svg
                class="w-20 hover:brightness-125"
                viewBox="0 0 150 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="Vector"
                  d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <div class="flex flex-row gap-4 mt-7">
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.instagram.com/safeplaceforyouth/"
                aria-label="Instagram"><Instagram size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.youtube.com/channel/UCUy5AnugYb4OhLuooZEByDA"
                aria-label="YouTube"><Youtube size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://twitter.com/safeplace4youth"
                aria-label="X (Twitter)"><BrandX size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.facebook.com/SafePlaceForYouth/"
                aria-label="Facebook"><Facebook size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.safeplaceforyouth.org/"
                aria-label="Website"><ExternalLink size={20} /></a
              >
            </div>

            <div
              in:fade={{ delay: 1200 }}
              out:fade={{ delay: 800 }}
              class="flex-row gap-5 flex mt-7"
            >
              <button
                transition:fade
                onclick={() => activeFeature--}
                class="{activeFeature === 0
                  ? 'opacity-40 pointer-events-none'
                  : ''} carousel-nav text-light-orange hover:text-orange bump">&lt; back</button
              >
              <button
                transition:fade
                onclick={() => activeFeature++}
                class="{activeFeature === 2
                  ? 'opacity-40 pointer-events-none'
                  : ''} carousel-nav text-light-orange hover:text-orange bump">next &gt;</button
              >
            </div>
          </div>
        </div>

        <div
          class="p-10 relative flex flex-col lg:flex-row gap-16 justify-start items-start lg:items-center w-full flex-shrink-0 transition-transform duration-700 ease-in"
          style="transform: translateX(-{activeFeature * 100}%)"
        >
          <img class="w-64" src={mfpLogo} alt="young people to the front logo" />
          <div>
            <h3 class="h-as-h5 text-orange mb-7">My Friend's place</h3>
            <p class="text-left">
              They offer a comprehensive continuum of services to 1,000 youth experiencing
              homelessness between the ages of 12 and 25, and their children, each year, helping our
              young people who are experiencing homelessness to move toward wellness, stability and
              self-sufficiency.
            </p>
            <a
              target="_blank"
              class="bump flex flex-row pt-5 gap-5 hover:gap-6 my-7 text-orange hover:brightness-125"
              href="https://www.myfriendsplace.org/"
            >
              <div class="btn-text">GO TO SITE</div>
              <svg
                class="w-20 hover:brightness-125"
                viewBox="0 0 150 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="Vector"
                  d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <div class="flex flex-row gap-4 mt-7">
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.instagram.com/myfriendsplace"
                aria-label="Instagram"><Instagram size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.youtube.com/channel/UCwP9v838Jx58xYUjZoqehIg"
                aria-label="YouTube"><Youtube size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://twitter.com/MFPLA"
                aria-label="X (Twitter)"><BrandX size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.facebook.com/mfphollywood/"
                aria-label="Facebook"><Facebook size={20} /></a
              >
              <a
                target="_blank"
                class="text-light-orange hover:text-orange transition-colors"
                href="https://www.myfriendsplace.org/"
                aria-label="Website"><ExternalLink size={20} /></a
              >
            </div>

            <div class="flex-row gap-5 flex mt-7">
              <button
                transition:fade
                onclick={() => activeFeature--}
                class="{activeFeature === 0
                  ? 'opacity-40 pointer-events-none'
                  : ''} carousel-nav text-light-orange hover:text-orange bump">&lt; back</button
              >
              <button
                transition:fade
                onclick={() => activeFeature++}
                class="{activeFeature === 2
                  ? 'opacity-40 pointer-events-none'
                  : ''} carousel-nav text-light-orange hover:text-orange bump">next &gt;</button
              >
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center max-w-screen-md mb-12">
        <div class="flex flex-row justify-center items-center gap-16 px-4">
          <div class="">
            <span class="flex flex-col items-center justify-center gap-2">
              <img class="" src={house} alt="house" />
            </span>
          </div>
          <div class="">
            <span class="flex flex-col items-center justify-center gap-2">
              <img class="" src={present} alt="present" />
            </span>
          </div>
          <div class="">
            <span class="flex flex-col items-center justify-center gap-2">
              <img class="" src={heart} alt="heart" />
            </span>
          </div>
        </div>
        <p class="text-center my-12 mx-[8%]">
          Explore this list to see how you can share, support, or engage with these organizations!
        </p>
      </div>

      <ContentWidth class="mb-32 w-full">
        <div class="w-full flex flex-col cursor-pointer">
          {#each orgs as org, i (org)}
            <button
              class="w-full cursor-pointer border-light-orange border-opacity-25 border-b-2 px-8"
              onclick={() => handleAccordianClick(i)}
            >
              <div
                class="lg:h-20 py-8 w-full flex flex-col gap-6 lg:flex-row justify-between items-start lg:items-center text-light-orange"
              >
                <h3 class="h-as-h5 text-orange text-left">{org.name}</h3>
                <div class="flex flex-row justify-start gap-8">
                  <div class="btn-text">
                    {activeAccordians[i] ? "less -" : "about +"}
                  </div>
                  <a
                    target="_blank"
                    href={org.siteUrl}
                    class="flex flex-row bump gap-3 hover:text-orange"
                  >
                    <div class="btn-text">Go to Site</div>
                    <svg
                      class="w-16"
                      viewBox="0 0 150 31"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        id="Vector"
                        d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              {#if activeAccordians[i]}
                <div
                  class="w-full flex flex-col lg:flex-row gap-16 py-16 text-left items-start justify-start"
                  transition:slide={{ duration: 500 }}
                >
                  <img
                    class=" lg:max-h-48 w-64 drop-shadow"
                    src={org.logo}
                    alt="young people to the front logo"
                  />
                  <div>
                    <p class="text-left normal-case tracking-normal">
                      {org.bodyCopy}
                    </p>

                    <div class="flex flex-row gap-4 mt-7">
                      {#if org.instagram}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.instagram}
                          aria-label="Instagram"><Instagram size={20} /></a
                        >
                      {/if}
                      {#if org.youtube}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.youtube}
                          aria-label="YouTube"><Youtube size={20} /></a
                        >
                      {/if}
                      {#if org.twitter}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.twitter}
                          aria-label="X (Twitter)"><BrandX size={20} /></a
                        >
                      {/if}
                      {#if org.facebook}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.facebook}
                          aria-label="Facebook"><Facebook size={20} /></a
                        >
                      {/if}
                      {#if org.linkedin}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.linkedin}
                          aria-label="LinkedIn"><Linkedin size={20} /></a
                        >
                      {/if}
                      {#if org.podcast}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.podcast}
                          aria-label="Podcast"><Mic size={20} /></a
                        >
                      {/if}
                      {#if org.tiktok}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.tiktok}
                          aria-label="TikTok"><BrandTiktok size={20} /></a
                        >
                      {/if}
                      <a
                        target="_blank"
                        class="text-light-orange hover:text-orange transition-colors"
                        href={org.siteUrl}
                        aria-label="Website"><ExternalLink size={20} /></a
                      >
                    </div>
                  </div>
                </div>
              {/if}
            </button>
          {/each}
        </div>
      </ContentWidth>

      <h2 class="h-as-h3 text-orange my-9">Awareness Groups & Initiatives</h2>

      <ContentWidth class="mb-32 w-full">
        <div class="w-full flex flex-col cursor-pointer">
          {#each groups as org, i (org)}
            <button
              class="w-full cursor-pointer border-light-orange border-opacity-25 border-b-2 px-8"
              onclick={() => handleAccordianClick(i + orgs.length)}
            >
              <div
                class="lg:h-20 py-8 w-full flex flex-col gap-6 lg:flex-row justify-between items-start lg:items-center text-light-orange"
              >
                <h3 class="h-as-h5 text-orange text-left lg:max-w-[70%]">{org.name}</h3>
                <div class="flex flex-row justify-start gap-8">
                  <div class="btn-text">
                    {activeAccordians[i + orgs.length] ? "less -" : "about +"}
                  </div>
                  <a
                    target="_blank"
                    href={org.siteUrl}
                    class="flex flex-row bump gap-3 hover:text-orange"
                  >
                    <div class="btn-text">Go to Site</div>
                    <svg
                      class="w-16"
                      viewBox="0 0 150 31"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        id="Vector"
                        d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              {#if activeAccordians[i + orgs.length]}
                <div
                  class="w-full flex flex-col lg:flex-row gap-16 py-16 text-left items-start justify-start"
                  transition:slide={{ duration: 500 }}
                >
                  <img class=" lg:max-h-48 w-64 drop-shadow" src={org.logo} alt="" />
                  <div>
                    <p class="text-left normal-case tracking-normal">
                      {org.bodyCopy}
                    </p>

                    <div class="flex flex-row gap-4 mt-7">
                      {#if org.instagram}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.instagram}
                          aria-label="Instagram"><Instagram size={20} /></a
                        >
                      {/if}
                      {#if org.youtube}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.youtube}
                          aria-label="YouTube"><Youtube size={20} /></a
                        >
                      {/if}
                      {#if org.twitter}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.twitter}
                          aria-label="X (Twitter)"><BrandX size={20} /></a
                        >
                      {/if}
                      {#if org.facebook}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.facebook}
                          aria-label="Facebook"><Facebook size={20} /></a
                        >
                      {/if}

                      {#if org.tiktok}
                        <a
                          target="_blank"
                          class="text-light-orange hover:text-orange transition-colors"
                          href={org.tiktok}
                          aria-label="TikTok"><BrandTiktok size={20} /></a
                        >
                      {/if}
                      <a
                        target="_blank"
                        class="text-light-orange hover:text-orange transition-colors"
                        href={org.siteUrl}
                        aria-label="Website"><ExternalLink size={20} /></a
                      >
                    </div>
                  </div>
                </div>
              {/if}
            </button>
          {/each}
        </div>
      </ContentWidth>
    </div>
    <div class="w-screen bg-help-dark py-20" id="sources">
      <ContentWidth>
        <h2 class="h-as-h3 text-orange">Our Sources</h2>
        <p class="text-center mb-20">
          Interested in learning more about homelessness? Visit the sources below
        </p>

        <div class="w-full border-b-[3px] border-help-light min-h-24 py-5 pb-20 md:pb-5 relative">
          <div class="lg:w-3/5 flex flex-col justify-between">
            <p class="text-left">
              2023 Greater Los Angeles Youth Homeless Count — Los Angeles Continuum of Care
            </p>
            <p class="text-orange text-left">LAHSA</p>
          </div>
          <a
            target="_blank"
            href="https://www.lahsa.org/news?article=944-2023-greater-los-angeles-homeless-count-data"
            class="bump absolute bottom-7 right-auto left-0 md:left-auto md:right-5 text-light-orange hover:text-orange flex flex-row gap-3 hover:gap-4"
          >
            <div class="btn-text">Go to Source</div>
            <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                id="Vector"
                d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <div class="w-full border-b-[3px] border-help-light min-h-24 py-5 pb-20 md:pb-5 relative">
          <div class="lg:w-3/5 h-full flex flex-col justify-between">
            <p class="text-left">One in 10 Young Adults Experience Homelessness During One Year</p>
            <p class="text-orange text-left">Chapin Hall at the University of Chicago</p>
          </div>
          <a
            target="_blank"
            href="https://www.chapinhall.org/research/one-in-10-young-adults-experience-homelessness-during-one-year/"
            class="bump absolute bottom-7 right-auto left-0 md:left-auto md:right-5 text-light-orange hover:text-orange flex flex-row gap-3 hover:gap-4"
          >
            <div class="btn-text">Go to Source</div>
            <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                id="Vector"
                d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <div class="w-full border-b-[3px] border-help-light min-h-24 py-5 pb-20 md:pb-5 relative">
          <div class="w-5/6 lg:w-3/5 h-full flex flex-col justify-between">
            <p class="text-left">Affirming Truths about Homelessness</p>
            <p class="text-orange text-left">Community Solutions</p>
          </div>
          <a
            target="_blank"
            href="https://community.solutions/research-posts/the-truth-about-homelessness/"
            class="bump absolute bottom-7 right-auto left-0 md:left-auto md:right-5 text-light-orange hover:text-orange flex flex-row gap-3 hover:gap-4"
          >
            <div class="btn-text">Go to Source</div>
            <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                id="Vector"
                d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <div class="w-full border-b-[3px] border-help-light min-h-24 py-5 pb-20 md:pb-5 relative">
          <div class="w-5/6 lg:w-3/5 h-full flex flex-col justify-between">
            <p class="text-left">The Case for Housing First</p>
            <p class="text-orange text-left">National Low Income Housing Coalition</p>
          </div>
          <a
            target="_blank"
            href="https://nlihc.org/sites/default/files/Housing-First-Research.pdf"
            class="bump absolute bottom-7 right-auto left-0 md:left-auto md:right-5 text-light-orange hover:text-orange flex flex-row gap-3 hover:gap-4"
          >
            <div class="btn-text">Go to Source</div>
            <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                id="Vector"
                d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <div class="w-full border-b-[3px] border-help-light min-h-24 py-5 pb-20 md:pb-5 relative">
          <div class="w-5/6 lg:w-3/5 h-full flex flex-col justify-between">
            <p class="text-left">
              Learning about Homelessness Using Linked Survey and Administrative Data
            </p>
            <p class="text-orange text-left">
              B. D. Meyer, A. Wyse, A. Grunwaldt, C. Medalia, and D. Wu
            </p>
          </div>
          <a
            target="_blank"
            href="https://bfi.uchicago.edu/wp-content/uploads/2021/06/BFI_WP_2021-65.pdf"
            class="bump absolute bottom-7 right-auto left-0 md:left-auto md:right-5 text-light-orange hover:text-orange flex flex-row gap-3 hover:gap-4"
          >
            <div class="btn-text">Go to Source</div>
            <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                id="Vector"
                d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <div class="w-full border-b-[3px] border-help-light min-h-24 py-5 pb-20 md:pb-5 relative">
          <div class="w-5/6 lg:w-3/5 h-full flex flex-col justify-between">
            <p class="text-left">Abuse and Neglect in Orange County Emergency Shelters</p>
            <p class="text-orange text-left">ACLU SoCal</p>
          </div>
          <a
            target="_blank"
            href="https://www.aclusocal.org/sites/default/files/aclu_socal_oc_shelters_report.pdf"
            class="bump absolute bottom-7 right-auto left-0 md:left-auto md:right-5 text-light-orange hover:text-orange flex flex-row gap-3 hover:gap-4"
          >
            <div class="btn-text">Go to Source</div>
            <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                id="Vector"
                d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <div class="w-full border-b-[3px] border-help-light min-h-24 py-5 pb-20 md:pb-5 relative">
          <div class="w-5/6 lg:w-3/5 h-full flex flex-col justify-between">
            <p class="text-left">Mental Health Among Students Experiencing Homelessness</p>
            <p class="text-orange text-left">After 8 to Educate</p>
          </div>
          <a
            target="_blank"
            href="https://after8toeducate.com/mental-health-students-experiencing-homelessness/"
            class="bump absolute bottom-7 right-auto left-0 md:left-auto md:right-5 text-light-orange hover:text-orange flex flex-row gap-3 hover:gap-4"
          >
            <div class="btn-text">Go to Source</div>
            <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                id="Vector"
                d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <div class="w-full mt-20 min-h-24 py-5 relative">
          <div class="lg:w-3/5 h-full flex flex-col gap-5 justify-between">
            <p class="text-left">
              If you have any suggestions or organizations you would like to share with us, please
              reach out. We are always looking to improve this site.
            </p>
            <button
              class="bump text-light-orange hover:text-orange flex flex-row gap-3 hover:gap-4"
              onclick={() => (isSuggestionModalActive = true)}
            >
              <div class="btn-text">I have a suggestion</div>
              <svg class="w-16" viewBox="0 0 150 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  id="Vector"
                  d="M3.05339 11.2409C38.1895 7.973 73.546 7.74546 108.722 10.5023C116.387 11.1044 124.041 11.8571 131.671 12.7373C131.13 12.4335 130.58 12.1442 130.035 11.8439C125.375 9.31656 120.715 6.78918 116.056 4.2618C114.907 3.64365 113.317 2.18852 114.418 0.820324C115.464 -0.484194 118.091 0.090017 119.293 0.744115C124.825 3.73931 130.357 6.73451 135.882 9.74452C140.394 12.1871 147.405 14.5337 149.421 19.7056C149.78 20.6233 149.582 21.3361 148.718 21.8718C142.302 25.772 135.318 28.5632 127.993 30.2237C126.304 30.5998 124.06 29.9674 122.949 28.5989C121.941 27.3684 122.308 25.9412 123.93 25.5691C130.241 24.1378 136.174 21.7916 141.763 18.5906C141.592 18.4013 141.42 18.2341 141.233 18.0662C140.521 18.3513 139.606 18.3718 138.964 18.299C104.576 13.9307 69.8531 12.4908 35.2271 14.0388C25.2928 14.4845 15.3646 15.1773 5.4654 16.0971C2.22322 16.4101 -1.83735 11.7036 3.05339 11.2409Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="w-full">
          <button class="bump hover:opacity-90" onclick={resetToFrameOne}>
            <img class="align-self-start mt-20 h-5" src={logo} alt="hearts and minds" />
          </button>
        </div>
      </ContentWidth>
    </div>
  </Panel>
</main>

<style>
  .carousel-nav {
    font-feature-settings:
      "clig" off,
      "liga" off;
    font-family: "search";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 115%; /* 16.1px */
  }

  ::placeholder,
  ::-moz-placeholder,
  ::-webkit-input-placeholder {
    color: rgba(236, 73, 47, 0.4);
    text-align: left;
    font-feature-settings:
      "clig" off,
      "liga" off;
    font-family: Poleno;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 125%; /* 18.75px */
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }
</style>
