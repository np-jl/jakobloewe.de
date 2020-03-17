let projects = document.getElementsByClassName('project');

for(project of projects) {
	project.addEventListener('mouseenter', event => {
		let projectTeaserStyle = event.currentTarget.getElementsByClassName('project-teaser')[0].style;
		projectTeaserStyle.height = event.currentTarget.offsetHeight * 1.2 + 'px';
		projectTeaserStyle.width = event.currentTarget.offsetWidth * 1.2 + 'px';
	});
	project.addEventListener('mouseleave', event => {
		let projectTeaserStyle = event.currentTarget.getElementsByClassName('project-teaser')[0].style;
		projectTeaserStyle.height = event.currentTarget.offsetHeight + 'px';
		projectTeaserStyle.width = event.currentTarget.offsetWidth + 'px';
		projectTeaserStyle.top = 0;
		projectTeaserStyle.left = 0;
	});
	project.addEventListener('mousemove', event => {
		let projectTeaserStyle = event.currentTarget.getElementsByClassName('project-teaser')[0].style;
		let projectTeaserTop = (event.pageY - event.currentTarget.offsetTop) / event.currentTarget.offsetHeight; // mouse position from project top in percent (0 = top / 1 = bottom)
		let projectTeaserLeft = (event.pageX - event.currentTarget.offsetLeft) / event.currentTarget.offsetWidth; // mouse position from project left in percent (0 = left / 1 = right)
		let projectTeaserHeight = parseInt(projectTeaserStyle.height);
		let projectTeaserWidth = parseInt(projectTeaserStyle.width);
		let heightDifference = projectTeaserHeight - event.currentTarget.offsetHeight;
		let widthDifference = projectTeaserWidth - event.currentTarget.offsetWidth;
		projectTeaserStyle.top = -heightDifference + (1 - projectTeaserTop) * heightDifference + 'px';
		projectTeaserStyle.left = -widthDifference + (1 - projectTeaserLeft) * widthDifference + 'px';
	});
}